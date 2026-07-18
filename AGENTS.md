# AGENTS.md — Contrato de execução do BlocoSite V1

Este arquivo é a autoridade operacional para qualquer agente de código que trabalhe neste repositório.

## 1. Missão

Construir o **BlocoSite V1**, um CMS visual simples, seguro e atraente para pequenos negócios brasileiros criarem e manterem landing pages, sites institucionais e blogs sem conhecimento técnico.

A V1 deve terminar como um produto utilizável em produção, não como demonstração. O usuário final deve conseguir criar um site, editar conteúdo por blocos, enviar imagens, visualizar, publicar, receber contatos e usar subdomínio ou domínio próprio.

## 2. Regra de congelamento

O escopo funcional, a arquitetura, o modelo de publicação, os tipos de bloco e a stack definidos neste pacote estão **congelados**.

Depois do início da implementação:

- não trocar framework, banco, ORM, gerenciador de pacotes ou organização do monorepo;
- não adicionar funcionalidades fora da V1;
- não remover funcionalidades obrigatórias da V1;
- não criar uma arquitetura paralela;
- não reescrever módulos estáveis apenas por preferência estética;
- não alterar contratos públicos já validados, exceto para corrigir erro, vulnerabilidade ou incompatibilidade real;
- qualquer correção estrutural inevitável deve preservar o comportamento definido e ser registrada em `DECISIONS.md`.

Itens desejáveis que não pertencem à V1 estão registrados em `docs/V2_NOTES.md` e **não devem ser implementados agora**.

## 3. Ordem obrigatória de leitura

Antes de escrever código, leia nesta ordem:

1. `README.md`
2. `AGENTS.md`
3. `docs/SCOPE_FREEZE.md`
4. `PRODUCT_SPEC.md`
5. `ARCHITECTURE.md`
6. `DATA_MODEL.md`
7. `BLOCKS_SPEC.md`
8. `API_CONTRACT.md`
9. `UX_UI_SPEC.md`
10. `docs/TEMPLATES_SPEC.md`
11. `docs/PERMISSIONS_MATRIX.md`
12. `docs/SITE_STATES.md`
13. `docs/RELEASE_WORKFLOWS.md`
14. `SECURITY.md`
15. `docs/PRIVACY_OPERATIONS.md`
16. `TESTING.md`
17. `DEPLOYMENT.md`
18. `ROADMAP.md`
19. `DECISIONS.md`
20. `ACCEPTANCE_CRITERIA.md`
21. `docs/V2_NOTES.md`
22. `PROJECT_STATUS.md`

Os documentos se complementam. Em caso de conflito, a prioridade é:

1. `AGENTS.md`
2. `DECISIONS.md`
3. `PRODUCT_SPEC.md`
4. `ARCHITECTURE.md`
5. demais especificações

## 4. Stack oficial e imutável

- Node.js 24 LTS;
- TypeScript em modo `strict`;
- pnpm 10 com workspaces;
- Turborepo apenas para orquestração de scripts;
- React 19.2;
- Next.js 16 App Router para `apps/admin` e `apps/sites`;
- Fastify 5 para `apps/api`;
- PostgreSQL 18;
- Prisma ORM 6, usando a última correção disponível da linha 6.x no momento do bootstrap e travada no lockfile;
- Zod 4 para contratos e validação;
- Tailwind CSS 4;
- componentes acessíveis baseados em Radix UI;
- TipTap para conteúdo rico de artigos;
- dnd-kit para reordenação dos blocos;
- MinIO em desenvolvimento e armazenamento compatível com S3 em produção;
- Sharp para processamento de imagens;
- Caddy 2 para proxy, subdomínios e TLS de domínios personalizados;
- Mailpit em desenvolvimento e SMTP em produção;
- Vitest para testes unitários e de integração;
- Playwright para testes ponta a ponta;
- Docker e Docker Compose;
- GitHub Actions para integração contínua.

Não substituir por NestJS, Express, Vite SPA, MongoDB, Supabase, Firebase, Drizzle, Sequelize, Redis, GraphQL, microserviços adicionais ou serviços SaaS obrigatórios.

## 5. Estrutura oficial

```text
blocosite/
├── apps/
│   ├── admin/                 # painel autenticado
│   ├── api/                   # API Fastify
│   └── sites/                 # renderizador público multi-tenant
├── packages/
│   ├── blocks/                # esquemas, registry e renderizadores compartilhados
│   ├── contracts/             # DTOs e schemas Zod
│   ├── database/              # Prisma schema, client, migrations e seed
│   ├── design-system/         # componentes e tokens reutilizáveis
│   ├── eslint-config/
│   ├── tsconfig/
│   └── utils/
├── infra/
│   ├── caddy/
│   └── docker/
├── docs/
├── prompts/
├── .github/workflows/
├── AGENTS.md
├── ROADMAP.md
├── DECISIONS.md
├── PROJECT_STATUS.md
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Não criar pastas genéricas como `common`, `misc`, `helpers2`, `new-api` ou `legacy`.

## 6. Escopo obrigatório da V1

A V1 inclui:

- cadastro, verificação de e-mail, login, logout, recuperação e redefinição de senha;
- sessão opaca em cookie seguro, sem JWT no navegador;
- usuário com vários sites;
- papéis `OWNER`, `EDITOR` e `PLATFORM_ADMIN`;
- assistente de criação de site;
- quatro templates oficiais;
- editor visual por blocos;
- visualização desktop, tablet e celular;
- reordenação, duplicação, ocultação, remoção, desfazer e refazer;
- salvamento automático de rascunho;
- preview privado;
- publicação atômica por release;
- histórico e restauração de releases;
- biblioteca de mídia;
- processamento e variantes de imagens;
- páginas e blog;
- cabeçalho, navegação e rodapé globais;
- personalização por tokens controlados;
- SEO básico, sitemap, robots e RSS;
- formulário de contato com antispam e painel de mensagens;
- subdomínio automático;
- domínio próprio com verificação DNS e TLS automático;
- painel mínimo de administração da plataforma;
- limites de uso configuráveis sem cobrança automática;
- auditoria de ações críticas;
- documentação de desenvolvimento e implantação;
- testes unitários, integração e E2E dos fluxos críticos.

A V1 não inclui:

- e-commerce;
- pagamentos ou assinatura automática;
- sistema de plugins;
- marketplace de temas;
- HTML, CSS ou JavaScript personalizados;
- iframe ou embed arbitrário;
- inteligência artificial;
- aplicativo mobile;
- múltiplos idiomas;
- área de membros;
- comentários no blog;
- newsletter;
- automação de marketing;
- analytics avançado;
- colaboração em tempo real;
- exportação completa do site;
- white-label para agências.

## 7. Regras de implementação

### 7.1 Qualidade

- TypeScript `strict` em todo o projeto.
- Não usar `any` explícito sem justificativa registrada no código.
- Não ignorar erros com `eslint-disable`, `@ts-ignore` ou `@ts-expect-error` sem comentário específico.
- Toda entrada externa deve ser validada por Zod.
- Toda rota deve verificar autenticação e autorização quando aplicável.
- Toda consulta de recurso de site deve filtrar pelo `siteId` autorizado.
- Datas são armazenadas em UTC e apresentadas no fuso configurado pelo usuário.
- IDs são UUIDs gerados pela aplicação ou banco, conforme o schema oficial.
- Slugs são normalizados e únicos no escopo do site.
- Arquivos e imagens nunca são identificados apenas pelo nome original.
- Conteúdo público nunca executa HTML fornecido pelo usuário.

### 7.2 Banco de dados

- Toda mudança de schema exige migration Prisma versionada.
- Não usar `prisma db push` como mecanismo normal de evolução.
- O seed deve ser idempotente.
- Não editar migration já aplicada; criar outra.
- Não armazenar senha, token ou segredo em texto puro.
- Exclusões que afetem histórico publicado devem ser `soft delete`.
- Releases publicados são imutáveis.

### 7.3 API

- Prefixo `/v1` para rotas públicas da API.
- Resposta de erro padronizada com `code`, `message`, `details` e `requestId`.
- Paginação por cursor nas listas potencialmente grandes.
- Idempotência em publicação e upload finalizado.
- Rate limit em autenticação, formulário público, preview e verificação de domínio.
- Não expor stack trace em produção.

### 7.4 Interface

- UI em português do Brasil.
- Layout responsivo desde a primeira fase visual.
- Acessibilidade mínima WCAG 2.2 AA nos fluxos essenciais.
- Todo botão iconográfico deve ter nome acessível.
- Estados de carregamento, vazio, erro e sucesso são obrigatórios.
- Alterações destrutivas exigem confirmação.
- O editor deve funcionar sem arrastar: fornecer botões mover para cima/baixo.
- Autosave deve mostrar `Salvando`, `Salvo` ou `Erro ao salvar`.

### 7.5 Segurança

- Seguir integralmente `SECURITY.md`.
- Senhas com Argon2id.
- Cookies `HttpOnly`, `Secure` em produção e `SameSite=Lax`.
- Proteção CSRF em operações autenticadas mutáveis.
- Upload sem SVG na V1.
- URLs externas aceitam apenas `https`, `http`, `mailto`, `tel` e links internos validados.
- Bloquear `javascript:`, `data:` e protocolos desconhecidos.
- Sanitizar conteúdo TipTap no servidor.

## 8. Fluxo de trabalho obrigatório

Para cada fase do `ROADMAP.md`:

1. Ler os critérios da fase.
2. Inspecionar o código existente antes de editar.
3. Implementar somente o escopo da fase.
4. Criar ou atualizar migrations quando necessário.
5. Criar testes junto com a implementação.
6. Rodar lint, typecheck, testes e build dos pacotes afetados.
7. Corrigir todos os erros encontrados.
8. Executar os critérios manuais da fase.
9. Atualizar `PROJECT_STATUS.md` com evidências reais.
10. Marcar a fase como concluída no `ROADMAP.md` somente após aprovação de todos os gates.
11. Fazer commit pequeno e coerente, quando o ambiente permitir.
12. Prosseguir para a fase seguinte.

Não declarar uma fase concluída com testes quebrados, arquivos vazios, endpoints simulados, dados falsos permanentes ou funcionalidades apenas visuais. Antes de iniciar e ao final de cada fase, execute `scripts/verify-scope-freeze.sh`.

## 9. Política de placeholders

Placeholders são permitidos apenas durante a fase em andamento e devem ser removidos antes de concluí-la.

Proibido ao final de uma fase:

- `TODO` que afete requisito da fase;
- endpoint retornando valor fixo;
- botão sem ação;
- formulário sem persistência;
- tabela sem estado de erro/vazio;
- mock no caminho de produção;
- segredo real versionado;
- arquivo criado apenas para satisfazer estrutura.

## 10. Política de testes

Nenhuma funcionalidade crítica é aceita sem teste.

Obrigatórios:

- unitários para validações, slugs, permissões, schemas de bloco e sanitização;
- integração para autenticação, autorização, CRUD, publicação, upload e formulários;
- E2E para cadastro/login, criação de site, edição, preview, publicação, blog, contato e domínio;
- teste de isolamento multi-tenant;
- teste de restauração de release;
- teste de falha do autosave e recuperação;
- teste de acessibilidade automatizado nas telas principais.

## 11. Comandos de validação esperados

Ao final do bootstrap, o repositório deve disponibilizar:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
pnpm db:migrate
pnpm db:seed
```

`pnpm check` deve executar lint, typecheck e testes unitários.

## 12. Critério global de conclusão

O projeto só está concluído quando:

- todos os itens de `ACCEPTANCE_CRITERIA.md` passam;
- todas as fases obrigatórias estão concluídas;
- a aplicação sobe do zero com as instruções do README;
- o fluxo principal funciona em desktop e celular;
- nenhum segredo real está no repositório;
- todas as migrations executam em banco vazio;
- o seed cria o ambiente de demonstração;
- CI está verde;
- não existem erros conhecidos de severidade alta ou crítica;
- o produto pode ser implantado conforme `DEPLOYMENT.md`;
- a V2 permanece apenas documentada.

## 13. Quando uma decisão não estiver explícita

Não inventar uma nova funcionalidade. Escolher a opção mais simples que:

1. preserve a arquitetura;
2. cumpra os critérios de aceitação;
3. mantenha segurança e acessibilidade;
4. não crie dependência externa obrigatória;
5. possa ser testada.

Registrar decisões técnicas relevantes em `DECISIONS.md`, sem alterar o escopo congelado.
