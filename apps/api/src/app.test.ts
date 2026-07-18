import { describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

describe('health', () => {
  const environment = { NODE_ENV: 'test' as const, API_HOST: '127.0.0.1', API_PORT: 3333, DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:1/invalid', APP_BASE_URL: 'http://localhost:3000', SESSION_PEPPER: 'test-session-pepper-with-32-characters', TOKEN_PEPPER: 'test-token-pepper-with-at-least-32-chars', SMTP_HOST: '127.0.0.1', SMTP_PORT: 1025, SMTP_FROM_EMAIL: 'test@blocosite.local' };
  it('responde ao liveness sem depender de serviços externos', async () => {
    const app = buildApp(environment);
    const response = await app.inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ok', service: 'api' });
    await app.close();
  });

  it('indica indisponibilidade quando o banco não está acessível', async () => {
    const app = buildApp(environment);
    const response = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({ status: 'degraded', checks: { database: 'unavailable' } });
    await app.close();
  });
});
