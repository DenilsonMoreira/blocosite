# BlocoSite V1

CMS visual simples para pequenos negócios brasileiros criarem landing pages, sites institucionais e blogs sem editar código.

## Objetivo da V1

Entregar uma ferramenta comercialmente utilizável na qual uma pessoa leiga consegue:

1. criar uma conta;
2. escolher um modelo;
3. personalizar identidade visual;
4. editar páginas por blocos;
5. enviar imagens;
6. criar artigos;
7. visualizar alterações;
8. publicar e restaurar versões;
9. receber mensagens de contato;
10. usar subdomínio ou domínio próprio.

## Princípio do produto

O BlocoSite não é um editor de layout totalmente livre. Ele oferece blocos controlados, responsivos e difíceis de quebrar. A simplicidade é uma funcionalidade central.

## Stack congelada

- Node.js 24 LTS;
- pnpm 10;
- TypeScript strict;
- React 19.2;
- Next.js 16;
- Fastify 5;
- PostgreSQL 18;
- Prisma ORM 6;
- Tailwind CSS 4;
- MinIO/S3;
- Caddy 2;
- Docker Compose.

## Aplicações

- `apps/admin`: painel autenticado e editor visual;
- `apps/api`: autenticação, regras de negócio, persistência e integrações;
- `apps/sites`: renderização pública multi-tenant.

## Como o Codex deve começar

1. Ler `AGENTS.md` integralmente.
2. Ler os documentos indicados na ordem definida.
3. Executar a Fase 0 de `ROADMAP.md`.
4. Não implementar itens de `docs/V2_NOTES.md`.
5. Atualizar `PROJECT_STATUS.md` com evidências ao concluir cada fase.

O prompt inicial pronto está em `prompts/CODEX_INITIAL_PROMPT.md`.

## Desenvolvimento local esperado

Após a Fase 0:

```bash
cp .env.example .env
corepack enable
pnpm install
docker compose up -d postgres minio mailpit
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Endereços locais previstos:

- Painel: `http://app.localhost`
- API: `http://api.localhost`
- Site demonstrativo: `http://demo.localhost`
- MinIO: `http://localhost:9001`
- Mailpit: `http://localhost:8025`

## Documentos principais

- `docs/SCOPE_FREEZE.md`: proteção contra alteração acidental do escopo;
- `PRODUCT_SPEC.md`: produto e escopo;
- `ARCHITECTURE.md`: arquitetura congelada;
- `DATA_MODEL.md`: modelo de dados;
- `BLOCKS_SPEC.md`: blocos permitidos;
- `docs/TEMPLATES_SPEC.md`: composição exata dos modelos;
- `docs/PERMISSIONS_MATRIX.md`: autorização por papel;
- `docs/SITE_STATES.md`: rascunho, ativo, suspenso e arquivado;
- `docs/RELEASE_WORKFLOWS.md`: publicação completa, individual e agendada;
- `API_CONTRACT.md`: contratos da API;
- `UX_UI_SPEC.md`: experiência e design;
- `SECURITY.md`: controles obrigatórios;
- `docs/PRIVACY_OPERATIONS.md`: privacidade, retenção e operação de dados;
- `TESTING.md`: estratégia de testes;
- `DEPLOYMENT.md`: implantação;
- `ROADMAP.md`: execução em fases;
- `ACCEPTANCE_CRITERIA.md`: definição verificável de conclusão;
- `docs/V2_NOTES.md`: melhorias futuras proibidas na V1.

## Licenciamento

A definição de licença comercial fica a cargo do proprietário antes da publicação do repositório. Até lá, não adicionar uma licença automaticamente.
