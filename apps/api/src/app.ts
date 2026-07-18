import { healthResponseSchema } from '@blocosite/contracts';
import { createRequestId } from '@blocosite/utils';
import Fastify, { type FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import postgres from 'postgres';
import type { Environment } from './config.js';
import { registerAuthRoutes } from './modules/auth/routes.js';
import { registerUserRoutes } from './modules/users/routes.js';

export function buildApp(environment: Environment): FastifyInstance {
  const app = Fastify({ logger: environment.NODE_ENV !== 'test', genReqId: createRequestId });
  void app.register(cookie);
  void app.register(registerAuthRoutes, environment);
  void app.register(registerUserRoutes, environment);

  app.get('/health/live', () => healthResponseSchema.parse({
    status: 'ok', service: 'api', timestamp: new Date().toISOString(),
  }));

  app.get('/health/ready', async (_request, reply) => {
    const sql = postgres(environment.DATABASE_URL, { max: 1, connect_timeout: 2 });
    try {
      await sql`select 1`;
      return healthResponseSchema.parse({ status: 'ok', service: 'api', timestamp: new Date().toISOString(), checks: { database: 'ok' } });
    } catch {
      reply.code(503);
      return healthResponseSchema.parse({ status: 'degraded', service: 'api', timestamp: new Date().toISOString(), checks: { database: 'unavailable' } });
    } finally {
      await sql.end({ timeout: 1 });
    }
  });

  return app;
}
