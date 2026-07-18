# PROJECT_STATUS.md

## Estado atual

- Projeto: BlocoSite V1
- Fase atual: Fase 1 — Banco e autenticação
- Status: em andamento
- Última atualização: 2026-07-18

## Fase 0 — Bootstrap do monorepo

**Status:** concluída

**Implementado:**

- monorepo pnpm 10 e Turborepo com Node.js 24;
- apps Next.js `admin` e `sites`, API Fastify e packages oficiais;
- TypeScript strict, ESLint flat config, Prettier, Vitest e lockfile;
- validação Zod de ambiente e health checks live/ready com PostgreSQL real;
- Dockerfile multi-stage para desenvolvimento, validação, build e execução;
- Docker Compose para admin, API, sites, PostgreSQL 18, MinIO e Mailpit;
- workflow GitHub Actions executando a mesma validação Docker local;
- páginas iniciais responsivas em pt-BR e README executável.

**Migrations:**

- nenhuma; schema Prisma começa na Fase 1.

**Testes adicionados:**

- `apps/api/src/app.test.ts`: liveness e readiness degradado sem banco;
- `packages/contracts/src/index.test.ts`: contrato de resposta de saúde;
- `packages/utils/src/index.test.ts`: geração de request ID.

**Comandos executados:**

```text
docker compose --profile tools run --build --rm validate
resultado: lint, typecheck, 4 testes unitários, integração e build passaram

docker compose up -d --build
resultado: seis serviços iniciados; portas alternativas usadas por conflito local

GET /api/health (admin e sites), GET /health/live e GET /health/ready
resultado: HTTP 200, status ok; readiness confirmou database=ok
```

**Validação manual:**

- admin em `http://localhost:3100/api/health`: ok;
- API em `http://localhost:3334/health/live`: ok;
- API em `http://localhost:3334/health/ready`: banco ok;
- sites em `http://localhost:3101/api/health`: ok;
- PostgreSQL, MinIO e Mailpit reportaram healthy no Compose.

**Pendências da fase:**

- nenhuma.

**Correções/decisões registradas:**

- nenhuma mudança no escopo congelado; volume do PostgreSQL 18 usa `/var/lib/postgresql`, conforme a imagem oficial.

## Histórico

- Fase 0 concluída em 2026-07-18 com validação integral em Docker.

## Fase 1 — Banco e autenticação

**Status:** em andamento

**Implementado:**

- schema Prisma 6 inicial para User, Session, tokens de verificação/reset e AuditLog;
- migration PostgreSQL 18 com `citext`, UUIDs, índices e relações;
- senhas Argon2id e tokens aleatórios armazenados somente por hash;
- registro, verificação de e-mail, login, sessão, logout com CSRF, esqueci senha e reset;
- cookies `HttpOnly`, `SameSite=Lax` e `Secure` em produção;
- SMTP integrado ao Mailpit e migration automática como job único do Compose.
- consulta e atualização de perfil, troca de senha com revogação global, encerramento lógico e listagem/revogação de sessões;
- auditoria persistida para troca de senha e encerramento de conta.
- CORS restrito ao painel, rate limit nas rotas públicas de autenticação e tela acessível de login.

**Migrations:**

- `20260718202000_initial_auth`.

**Testes adicionados:**

- validação manual real de registro, login, sessão e logout com CSRF;
- unitários existentes continuam passando; integração automatizada da autenticação ainda pendente.

**Comandos executados:**

```text
docker compose --profile tools run --build --rm validate
resultado: lint, typecheck, testes e build passaram

docker compose up -d --build
resultado: migration aplicada antes da API e serviços saudáveis
```

**Validação manual:**

- registro criou usuário e mensagem de verificação no Mailpit;
- login retornou usuário e cookies de sessão/CSRF;
- `/v1/auth/session` retornou a mesma conta;
- logout com `X-CSRF-Token` revogou a sessão.

**Pendências da fase:**

- troca de e-mail com reverificação;
- validação estrita de `Origin` nas mutações autenticadas;
- testes automatizados de integração para todos os fluxos;
- telas acessíveis de registro, verificação, login, recuperação e perfil;
- auditoria das ações críticas e validação completa de reset/revogação.

**Correções/decisões registradas:**

- nenhuma mudança no escopo congelado.
