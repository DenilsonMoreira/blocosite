import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@blocosite/database';
import { z } from 'zod';
import { createTransport } from 'nodemailer';
import type { Environment } from '../../config.js';
import { authenticate, passwordHash, passwordMatches, publicUser, secureToken, tokenHash, validCsrf, validOrigin } from '../auth/service.js';

function failure(reply: FastifyReply, request: FastifyRequest, status: number, code: string, message: string) {
  return reply.code(status).send({ error: { code, message, details: {}, requestId: request.id } });
}

async function authorized(request: FastifyRequest, reply: FastifyReply, environment: Environment) {
  const session = await authenticate(request.cookies.blocosite_session, environment);
  if (!session) failure(reply, request, 401, 'AUTH_REQUIRED', 'Entre para continuar.');
  return session;
}

export function registerUserRoutes(app: FastifyInstance, environment: Environment) {
  const mail = createTransport({ host: environment.SMTP_HOST, port: environment.SMTP_PORT, secure: false });
  function mutationAllowed(request: FastifyRequest, storedHash: string): boolean {
    return validOrigin(request.headers.origin, environment) && validCsrf(request.headers['x-csrf-token'], storedHash, environment);
  }
  app.get('/v1/me', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    return { data: publicUser(session.user), meta: { requestId: request.id } };
  });

  app.patch('/v1/me', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    if (!mutationAllowed(request, session.csrfSecretHash)) return failure(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    const parsed = z.object({ name: z.string().trim().min(2).max(120).optional(), timezone: z.string().min(3).max(80).optional() }).safeParse(request.body);
    if (!parsed.success) return failure(reply, request, 400, 'VALIDATION_ERROR', 'Revise os dados informados.');
    const data: { name?: string; timezone?: string } = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.timezone !== undefined) data.timezone = parsed.data.timezone;
    const user = await prisma.user.update({ where: { id: session.userId }, data });
    return { data: publicUser(user), meta: { requestId: request.id } };
  });

  app.post('/v1/me/change-password', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    if (!mutationAllowed(request, session.csrfSecretHash)) return failure(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    const parsed = z.object({ currentPassword: z.string(), newPassword: z.string().min(10).max(128) }).safeParse(request.body);
    if (!parsed.success || !(await passwordMatches(session.user.passwordHash, parsed.data.currentPassword))) return failure(reply, request, 400, 'INVALID_CREDENTIALS', 'A senha atual não confere.');
    await prisma.$transaction([
      prisma.user.update({ where: { id: session.userId }, data: { passwordHash: await passwordHash(parsed.data.newPassword) } }),
      prisma.session.updateMany({ where: { userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
      prisma.auditLog.create({ data: { actorUserId: session.userId, action: 'USER_PASSWORD_CHANGED', targetType: 'User', targetId: session.userId, requestId: request.id } }),
    ]);
    reply.clearCookie('blocosite_session', { path: '/' }).clearCookie('blocosite_csrf', { path: '/' });
    return { data: { success: true }, meta: { requestId: request.id } };
  });

  app.post('/v1/me/change-email', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    if (!mutationAllowed(request, session.csrfSecretHash)) return failure(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    const parsed = z.object({ password: z.string().max(128), email: z.email().transform((value) => value.toLowerCase()) }).safeParse(request.body);
    if (!parsed.success || !(await passwordMatches(session.user.passwordHash, parsed.data.password))) return failure(reply, request, 400, 'INVALID_CREDENTIALS', 'A senha atual não confere.');
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== session.userId) return failure(reply, request, 409, 'EMAIL_ALREADY_EXISTS', 'Este e-mail já está em uso.');
    const raw = secureToken();
    await prisma.$transaction([
      prisma.user.update({ where: { id: session.userId }, data: { email: parsed.data.email, emailVerifiedAt: null } }),
      prisma.emailVerificationToken.create({ data: { userId: session.userId, tokenHash: tokenHash(raw, environment.TOKEN_PEPPER), expiresAt: new Date(Date.now() + 86_400_000) } }),
      prisma.session.updateMany({ where: { userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
      prisma.auditLog.create({ data: { actorUserId: session.userId, action: 'USER_EMAIL_CHANGED', targetType: 'User', targetId: session.userId, requestId: request.id } }),
    ]);
    await mail.sendMail({ from: environment.SMTP_FROM_EMAIL, to: parsed.data.email, subject: 'Confirme seu novo e-mail', text: `Confirme seu e-mail: ${environment.APP_BASE_URL}/verificar-email?token=${encodeURIComponent(raw)}` });
    reply.clearCookie('blocosite_session', { path: '/' }).clearCookie('blocosite_csrf', { path: '/' });
    return { data: { verificationPending: true }, meta: { requestId: request.id } };
  });

  app.get('/v1/me/sessions', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    const sessions = await prisma.session.findMany({ where: { userId: session.userId, revokedAt: null, expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' } });
    return { data: sessions.map((item) => ({ id: item.id, current: item.id === session.id, createdAt: item.createdAt, lastSeenAt: item.lastSeenAt, expiresAt: item.expiresAt })), meta: { requestId: request.id } };
  });

  app.delete('/v1/me/sessions/:sessionId', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    if (!mutationAllowed(request, session.csrfSecretHash)) return failure(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    const params = z.object({ sessionId: z.uuid() }).safeParse(request.params);
    if (!params.success) return failure(reply, request, 404, 'RESOURCE_NOT_FOUND', 'Sessão não encontrada.');
    const result = await prisma.session.updateMany({ where: { id: params.data.sessionId, userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } });
    if (!result.count) return failure(reply, request, 404, 'RESOURCE_NOT_FOUND', 'Sessão não encontrada.');
    return { data: { success: true }, meta: { requestId: request.id } };
  });

  app.delete('/v1/me', async (request, reply) => {
    const session = await authorized(request, reply, environment);
    if (!session) return;
    if (!mutationAllowed(request, session.csrfSecretHash)) return failure(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    await prisma.$transaction([
      prisma.user.update({ where: { id: session.userId }, data: { status: 'CLOSED', deletedAt: new Date() } }),
      prisma.session.updateMany({ where: { userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
      prisma.auditLog.create({ data: { actorUserId: session.userId, action: 'USER_CLOSED', targetType: 'User', targetId: session.userId, requestId: request.id } }),
    ]);
    reply.clearCookie('blocosite_session', { path: '/' }).clearCookie('blocosite_csrf', { path: '/' });
    return { data: { success: true }, meta: { requestId: request.id } };
  });
}
