import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@blocosite/database';
import { buildApp } from '../../app.js';
import type { Environment } from '../../config.js';
import { passwordHash, secureToken, tokenHash } from './service.js';

const sendMail = vi.fn().mockResolvedValue({ messageId: 'test' });
vi.mock('nodemailer', () => ({ createTransport: () => ({ sendMail }) }));

const databaseUrl = process.env.DATABASE_URL;
const sessionPepper = process.env.SESSION_PEPPER;
const tokenPepper = process.env.TOKEN_PEPPER;
if (!databaseUrl || !sessionPepper || !tokenPepper) throw new Error('Ambiente de integração incompleto.');

const environment: Environment = {
  NODE_ENV: 'test', API_HOST: '127.0.0.1', API_PORT: 3333,
  DATABASE_URL: databaseUrl, APP_BASE_URL: 'http://localhost:3000',
  SESSION_PEPPER: sessionPepper, TOKEN_PEPPER: tokenPepper,
  SMTP_HOST: 'mailpit', SMTP_PORT: 1025, SMTP_FROM_EMAIL: 'test@blocosite.local',
};
const domain = '@fase1.integration';
const password = 'SenhaSegura#2026';

function cookieHeader(response: { headers: object }) {
  const values = (response.headers as Record<string, string | string[] | undefined>)['set-cookie'];
  return (Array.isArray(values) ? values : [values ?? '']).map((value) => value.split(';')[0]).join('; ');
}

beforeEach(async () => {
  sendMail.mockClear();
  await prisma.user.deleteMany({ where: { email: { endsWith: domain } } });
});
afterAll(async () => { await prisma.user.deleteMany({ where: { email: { endsWith: domain } } }); await prisma.$disconnect(); });

describe('autenticação integrada', () => {
  it('registra, verifica o e-mail e cria uma sessão opaca', async () => {
    const app = buildApp(environment);
    const email = `registro${domain}`;
    const registration = await app.inject({ method: 'POST', url: '/v1/auth/register', payload: { name: 'Pessoa Teste', email, password, acceptedTerms: true } });
    expect(registration.statusCode).toBe(201); expect(sendMail).toHaveBeenCalledOnce();
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const raw = secureToken();
    await prisma.emailVerificationToken.create({ data: { userId: user.id, tokenHash: tokenHash(raw, environment.TOKEN_PEPPER), expiresAt: new Date(Date.now() + 60_000) } });
    const verified = await app.inject({ method: 'POST', url: '/v1/auth/verify-email', payload: { token: raw } });
    expect(verified.statusCode).toBe(200); expect(cookieHeader(verified)).toContain('blocosite_session=');
    expect((await prisma.user.findUniqueOrThrow({ where: { email } })).emailVerifiedAt).not.toBeNull();
    await app.close();
  });

  it('rejeita login inválido e aplica rate limit', async () => {
    const app = buildApp(environment);
    for (let attempt = 0; attempt < 10; attempt += 1) { const response = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: `invalido${domain}`, password: 'incorreta' } }); expect(response.statusCode).toBe(401); }
    const limited = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email: `invalido${domain}`, password: 'incorreta' } });
    expect(limited.statusCode).toBe(429); await app.close();
  });

  it('protege mutações com Origin e CSRF e permite revogar sessão', async () => {
    const app = buildApp(environment); const email = `csrf${domain}`;
    await prisma.user.create({ data: { name: 'CSRF', email, passwordHash: await passwordHash(password), emailVerifiedAt: new Date() } });
    const login = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email, password } });
    const auth = login.json<{ data: { csrf: string } }>(); const cookie = cookieHeader(login);
    const denied = await app.inject({ method: 'PATCH', url: '/v1/me', headers: { cookie, origin: environment.APP_BASE_URL }, payload: { name: 'Alterado' } });
    expect(denied.statusCode).toBe(403);
    const wrongOrigin = await app.inject({ method: 'PATCH', url: '/v1/me', headers: { cookie, origin: 'https://evil.example', 'x-csrf-token': auth.data.csrf }, payload: { name: 'Alterado' } });
    expect(wrongOrigin.statusCode).toBe(403);
    const allowed = await app.inject({ method: 'PATCH', url: '/v1/me', headers: { cookie, origin: environment.APP_BASE_URL, 'x-csrf-token': auth.data.csrf }, payload: { name: 'Alterado' } });
    expect(allowed.statusCode).toBe(200);
    const logout = await app.inject({ method: 'POST', url: '/v1/auth/logout', headers: { cookie, origin: environment.APP_BASE_URL, 'x-csrf-token': auth.data.csrf } });
    expect(logout.statusCode).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/v1/auth/session', headers: { cookie } })).statusCode).toBe(401); await app.close();
  });

  it('usa o reset uma única vez e revoga todas as sessões', async () => {
    const app = buildApp(environment); const email = `reset${domain}`;
    const user = await prisma.user.create({ data: { name: 'Reset', email, passwordHash: await passwordHash(password), emailVerifiedAt: new Date() } });
    const login = await app.inject({ method: 'POST', url: '/v1/auth/login', payload: { email, password } }); const cookie = cookieHeader(login);
    const raw = secureToken(); await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: tokenHash(raw, environment.TOKEN_PEPPER), expiresAt: new Date(Date.now() + 60_000) } });
    const reset = await app.inject({ method: 'POST', url: '/v1/auth/reset-password', payload: { token: raw, password: 'NovaSenha#2026' } }); expect(reset.statusCode).toBe(200);
    expect((await app.inject({ method: 'GET', url: '/v1/auth/session', headers: { cookie } })).statusCode).toBe(401);
    expect((await app.inject({ method: 'POST', url: '/v1/auth/reset-password', payload: { token: raw, password: 'OutraSenha#2026' } })).statusCode).toBe(400);
    expect((await prisma.auditLog.findFirst({ where: { actorUserId: user.id, action: 'USER_PASSWORD_RESET' } }))).not.toBeNull(); await app.close();
  });
});
