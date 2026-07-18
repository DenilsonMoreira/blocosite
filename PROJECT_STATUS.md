# PROJECT_STATUS.md

## Estado atual

- Projeto: BlocoSite V1
- Fase atual: Fase 1 — Banco e autenticação
- Status: não iniciada
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
