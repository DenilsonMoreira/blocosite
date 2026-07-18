import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3333),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  APP_BASE_URL: z.url().default('http://localhost:3000'),
  SESSION_PEPPER: z.string().min(32),
  TOKEN_PEPPER: z.string().min(32),
  SMTP_HOST: z.string().default('mailpit'),
  SMTP_PORT: z.coerce.number().int().default(1025),
  SMTP_FROM_EMAIL: z.email().default('no-reply@blocosite.local'),
});

export type Environment = z.infer<typeof environmentSchema>;

export function readEnvironment(source: NodeJS.ProcessEnv = process.env): Environment {
  const result = environmentSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Configuração de ambiente inválida: ${z.prettifyError(result.error)}`);
  }
  return result.data;
}
