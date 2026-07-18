import { buildApp } from './app.js';
import { readEnvironment } from './config.js';

const environment = readEnvironment();
const app = buildApp(environment);

try {
  await app.listen({ host: environment.API_HOST, port: environment.API_PORT });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
