import { describe, expect, it } from 'vitest';
import { buildApp } from './app.js';

describe('health', () => {
  it('responde ao liveness sem depender de serviços externos', async () => {
    const app = buildApp({ NODE_ENV: 'test', API_HOST: '127.0.0.1', API_PORT: 3333, DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:1/invalid' });
    const response = await app.inject({ method: 'GET', url: '/health/live' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ok', service: 'api' });
    await app.close();
  });

  it('indica indisponibilidade quando o banco não está acessível', async () => {
    const app = buildApp({ NODE_ENV: 'test', API_HOST: '127.0.0.1', API_PORT: 3333, DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:1/invalid' });
    const response = await app.inject({ method: 'GET', url: '/health/ready' });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({ status: 'degraded', checks: { database: 'unavailable' } });
    await app.close();
  });
});
