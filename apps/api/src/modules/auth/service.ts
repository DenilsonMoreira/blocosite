import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { hash, verify } from 'argon2';
import { prisma } from '@blocosite/database';
import type { Environment } from '../../config.js';

const SESSION_DAYS = 30;

export function secureToken(): string {
  return randomBytes(32).toString('base64url');
}

export function tokenHash(token: string, pepper: string): string {
  return createHash('sha256').update(`${pepper}:${token}`).digest('hex');
}

export function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession(userId: string, environment: Environment) {
  const token = secureToken();
  const csrf = secureToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const session = await prisma.session.create({ data: {
    userId, tokenHash: tokenHash(token, environment.SESSION_PEPPER),
    csrfSecretHash: tokenHash(csrf, environment.SESSION_PEPPER), expiresAt,
  } });
  return { session, token, csrf, expiresAt };
}

export async function authenticate(sessionToken: string | undefined, environment: Environment) {
  if (!sessionToken) return null;
  return prisma.session.findFirst({
    where: { tokenHash: tokenHash(sessionToken, environment.SESSION_PEPPER), revokedAt: null, expiresAt: { gt: new Date() }, user: { status: 'ACTIVE', deletedAt: null } },
    include: { user: true },
  });
}

export async function passwordHash(password: string): Promise<string> {
  return hash(password, { type: 2, memoryCost: 19_456, timeCost: 2, parallelism: 1 });
}

export async function passwordMatches(encoded: string, password: string): Promise<boolean> {
  return verify(encoded, password);
}

export function publicUser(user: { id: string; name: string; email: string; emailVerifiedAt: Date | null; globalRole: string; timezone: string }) {
  return { id: user.id, name: user.name, email: user.email, emailVerified: Boolean(user.emailVerifiedAt), globalRole: user.globalRole, timezone: user.timezone };
}
