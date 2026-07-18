import { hash } from 'argon2';
import { prisma } from '../src/index.js';

const email = process.env.DEMO_USER_EMAIL ?? 'demo@blocosite.local';
const password = process.env.DEMO_USER_PASSWORD ?? 'BlocoSite-demo-2026';

await prisma.user.upsert({
  where: { email },
  update: {},
  create: { name: 'Usuário demonstração', email, passwordHash: await hash(password), emailVerifiedAt: new Date() },
});
await prisma.$disconnect();
