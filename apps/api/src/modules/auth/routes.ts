import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createTransport } from 'nodemailer';
import { z } from 'zod';
import { prisma } from '@blocosite/database';
import type { Environment } from '../../config.js';
import { authenticate, createSession, passwordHash, passwordMatches, publicUser, safeEqual, secureToken, tokenHash } from './service.js';

const password = z.string().min(10).max(128);
const registerSchema = z.object({ name: z.string().trim().min(2).max(120), email: z.email().transform((value) => value.toLowerCase()), password, acceptedTerms: z.literal(true) });
const loginSchema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().max(128) });
const tokenSchema = z.object({ token: z.string().min(32).max(200) });

function cookies(reply: FastifyReply, data: Awaited<ReturnType<typeof createSession>>, secure: boolean) {
  const common = { path: '/', sameSite: 'lax' as const, secure, expires: data.expiresAt };
  reply.setCookie('blocosite_session', data.token, { ...common, httpOnly: true });
  reply.setCookie('blocosite_csrf', data.csrf, { ...common, httpOnly: false });
}

function error(reply: FastifyReply, request: FastifyRequest, status: number, code: string, message: string) {
  return reply.code(status).send({ error: { code, message, details: {}, requestId: request.id } });
}

export function registerAuthRoutes(app: FastifyInstance, environment: Environment) {
  const mail = createTransport({ host: environment.SMTP_HOST, port: environment.SMTP_PORT, secure: false });
  const limited = { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } };

  app.post('/v1/auth/register', limited, async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) return error(reply, request, 400, 'VALIDATION_ERROR', 'Revise os dados informados.');
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return reply.code(202).send({ data: { verificationPending: true }, meta: { requestId: request.id } });
    const rawToken = secureToken();
    const user = await prisma.user.create({ data: {
      name: parsed.data.name, email: parsed.data.email, passwordHash: await passwordHash(parsed.data.password),
      verificationTokens: { create: { tokenHash: tokenHash(rawToken, environment.TOKEN_PEPPER), expiresAt: new Date(Date.now() + 86_400_000) } },
    } });
    await mail.sendMail({ from: environment.SMTP_FROM_EMAIL, to: user.email, subject: 'Confirme seu e-mail no BlocoSite', text: `Confirme sua conta: ${environment.APP_BASE_URL}/verificar-email?token=${encodeURIComponent(rawToken)}` });
    return reply.code(201).send({ data: { user: publicUser(user), verificationPending: true }, meta: { requestId: request.id } });
  });

  app.post('/v1/auth/verify-email', limited, async (request, reply) => {
    const parsed = tokenSchema.safeParse(request.body);
    if (!parsed.success) return error(reply, request, 400, 'VALIDATION_ERROR', 'Token inválido.');
    const record = await prisma.emailVerificationToken.findFirst({ where: { tokenHash: tokenHash(parsed.data.token, environment.TOKEN_PEPPER), usedAt: null, expiresAt: { gt: new Date() } }, include: { user: true } });
    if (!record) return error(reply, request, 400, 'VALIDATION_ERROR', 'Token inválido ou expirado.');
    const user = await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
      return tx.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } });
    });
    const session = await createSession(user.id, environment); cookies(reply, session, environment.NODE_ENV === 'production');
    return { data: { user: publicUser(user), csrf: session.csrf }, meta: { requestId: request.id } };
  });

  app.post('/v1/auth/login', limited, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return error(reply, request, 401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || user.status !== 'ACTIVE' || !(await passwordMatches(user.passwordHash, parsed.data.password))) return error(reply, request, 401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
    const session = await createSession(user.id, environment); cookies(reply, session, environment.NODE_ENV === 'production');
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return { data: { user: publicUser(user), csrf: session.csrf }, meta: { requestId: request.id } };
  });

  app.get('/v1/auth/session', async (request, reply) => {
    const session = await authenticate(request.cookies.blocosite_session, environment);
    if (!session) return error(reply, request, 401, 'AUTH_REQUIRED', 'Entre para continuar.');
    return { data: { user: publicUser(session.user), sites: [], csrf: request.cookies.blocosite_csrf, expiresAt: session.expiresAt }, meta: { requestId: request.id } };
  });

  app.post('/v1/auth/logout', async (request, reply) => {
    const session = await authenticate(request.cookies.blocosite_session, environment);
    if (!session) return error(reply, request, 401, 'AUTH_REQUIRED', 'Entre para continuar.');
    const csrf = request.headers['x-csrf-token'];
    if (typeof csrf !== 'string' || !safeEqual(tokenHash(csrf, environment.SESSION_PEPPER), session.csrfSecretHash)) return error(reply, request, 403, 'CSRF_INVALID', 'A sessão de segurança expirou.');
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
    reply.clearCookie('blocosite_session', { path: '/' }).clearCookie('blocosite_csrf', { path: '/' });
    return { data: { success: true }, meta: { requestId: request.id } };
  });

  app.post('/v1/auth/forgot-password', limited, async (request, reply) => {
    const parsed = z.object({ email: z.email().transform((value) => value.toLowerCase()) }).safeParse(request.body);
    if (parsed.success) {
      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
      if (user) {
        const raw = secureToken();
        await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: tokenHash(raw, environment.TOKEN_PEPPER), expiresAt: new Date(Date.now() + 3_600_000) } });
        await mail.sendMail({ from: environment.SMTP_FROM_EMAIL, to: user.email, subject: 'Redefina sua senha do BlocoSite', text: `Redefina sua senha: ${environment.APP_BASE_URL}/redefinir-senha?token=${encodeURIComponent(raw)}` });
      }
    }
    return reply.code(202).send({ data: { message: 'Se a conta existir, enviaremos as instruções.' }, meta: { requestId: request.id } });
  });

  app.post('/v1/auth/reset-password', limited, async (request, reply) => {
    const parsed = tokenSchema.extend({ password }).safeParse(request.body);
    if (!parsed.success) return error(reply, request, 400, 'VALIDATION_ERROR', 'Token ou senha inválidos.');
    const record = await prisma.passwordResetToken.findFirst({ where: { tokenHash: tokenHash(parsed.data.token, environment.TOKEN_PEPPER), usedAt: null, expiresAt: { gt: new Date() } } });
    if (!record) return error(reply, request, 400, 'VALIDATION_ERROR', 'Token inválido ou expirado.');
    await prisma.$transaction([
      prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
      prisma.user.update({ where: { id: record.userId }, data: { passwordHash: await passwordHash(parsed.data.password) } }),
      prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    ]);
    return { data: { success: true }, meta: { requestId: request.id } };
  });
}
