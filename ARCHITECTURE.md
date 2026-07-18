# ARCHITECTURE.md — Arquitetura congelada

## 1. Visão geral

O BlocoSite é um monorepo modular com três aplicações implantáveis e pacotes compartilhados.

```text
Navegador do administrador
        │
        ▼
apps/admin (Next.js)
        │ HTTPS + cookie de sessão + CSRF
        ▼
apps/api (Fastify)
        ├── PostgreSQL via packages/database
        ├── MinIO/S3
        ├── SMTP
        └── DNS resolver

Visitante
        │
        ▼
Caddy
        │ resolve host
        ▼
apps/sites (Next.js)
        ├── leitura do release ativo no PostgreSQL
        └── mídia pública em S3/MinIO
```

## 2. Monorepo

Usar pnpm workspaces e Turborepo somente para scripts, cache e dependências entre pacotes.

### Aplicações

#### `apps/admin`

- Next.js App Router;
- telas autenticadas;
- React Server Components para leitura inicial quando útil;
- Client Components apenas nas interações necessárias;
- editor visual com estado local controlado;
- comunicação com a API por cliente tipado gerado a partir dos contratos Zod compartilhados;
- não acessa Prisma diretamente.

#### `apps/api`

- Fastify;
- módulos por domínio;
- única autoridade para mutações de dados;
- autenticação, autorização, validação, publicação, upload, e-mail, DNS e auditoria;
- OpenAPI gerado das rotas e schemas;
- jobs internos leves para artigos agendados e manutenção.

#### `apps/sites`

- Next.js App Router;
- resolve o host solicitado;
- lê apenas conteúdo publicado;
- importa renderizadores de `packages/blocks`;
- não possui telas administrativas;
- não aceita conteúdo não validado;
- gera páginas, metadados, sitemap, robots e RSS;
- cacheia por host e release ativo.

### Pacotes

#### `packages/database`

- schema Prisma;
- migrations;
- client singleton por processo;
- seed;
- helpers de transação;
- nenhum código de UI.

#### `packages/contracts`

- schemas Zod de requests, responses, erros e eventos internos;
- tipos derivados por `z.infer`;
- sem dependência de Next ou Fastify.

#### `packages/blocks`

- registry oficial dos blocos;
- schemas discriminados;
- defaults;
- migração de versão de schema do bloco;
- validação;
- componentes de renderização pública;
- componentes de preview reutilizáveis;
- metadados do inspetor.

#### `packages/design-system`

- tokens;
- componentes acessíveis do painel;
- componentes não específicos de domínio;
- Storybook fica fora da V1.

#### `packages/utils`

- funções puras e realmente compartilhadas;
- slug, URL, datas, hashing não sensível, tamanho de arquivos;
- não virar depósito genérico.

## 3. Módulos da API

```text
src/modules/
├── auth/
├── users/
├── sites/
├── members/
├── pages/
├── posts/
├── media/
├── drafts/
├── releases/
├── domains/
├── forms/
├── templates/
├── platform-admin/
├── audit/
└── health/
```

Cada módulo deve conter, conforme necessário:

- `routes.ts`;
- `schemas.ts` apenas para adaptação Fastify, importando contratos compartilhados;
- `service.ts`;
- `repository.ts`;
- `errors.ts`;
- testes.

Não criar controller e service vazios apenas por padrão. A rota deve ser fina; regra de negócio fica no service; acesso a dados fica no repository.

## 4. Autenticação e sessão

### 4.1 Sessão

- sessão opaca com identificador aleatório de alta entropia;
- somente hash do token de sessão armazenado no banco;
- cookie `blocosite_session`;
- rotação de sessão após login, troca de senha e alteração de e-mail;
- expiração absoluta de 30 dias;
- atualização de `lastSeenAt` limitada para evitar escrita em toda requisição;
- revogação por logout, troca de senha, suspensão ou encerramento da conta.

### 4.2 CSRF

- token CSRF associado à sessão;
- enviado em cookie legível ou endpoint de bootstrap;
- mutações exigem cabeçalho `X-CSRF-Token`;
- validar `Origin` e `Host` nas rotas autenticadas mutáveis.

### 4.3 Autorização

- `PLATFORM_ADMIN` é global;
- `OWNER` e `EDITOR` são papéis em `SiteMember`;
- `OWNER` administra membros, domínio e configurações críticas;
- `EDITOR` edita conteúdo, mídia, posts e rascunhos, mas não remove site, membros ou domínios;
- toda autorização deve ser executada no servidor.

## 5. Multi-tenancy

O tenant funcional é o `Site`. Estados e transições são definidos em `docs/SITE_STATES.md`.

Regras:

- recursos de conteúdo carregam `siteId` diretamente ou por relação obrigatória;
- repositories nunca buscam recurso editável apenas por `id`; devem usar `id + siteId` ou verificar associação na mesma transação;
- testes devem tentar acesso cruzado entre dois sites;
- mídia é isolada por prefixo de armazenamento `sites/{siteId}/...`;
- domínio resolve para exatamente um site ativo;
- releases contêm somente recursos do próprio site.

Não usar schema PostgreSQL por tenant nem banco separado por cliente na V1.

## 6. Modelo de rascunho e publicação

### 6.1 Estado editável

- páginas, posts, navegação e tema possuem estado de rascunho;
- rascunhos podem mudar livremente;
- autosave grava revisão incremental e incrementa `draftRevision`;
- atualização usa controle otimista: cliente envia `expectedRevision`;
- conflito retorna `409 DRAFT_CONFLICT`.

### 6.2 Preview

- API cria `PreviewToken` com hash, site, usuário criador e expiração curta;
- `apps/sites` aceita o token por cookie temporário ou URL inicial;
- preview lê o estado de rascunho completo;
- token é de uso limitado, revogável e nunca aparece em logs completos.

### 6.3 Release

Publicação é transacional:

1. bloquear publicação concorrente do site;
2. validar rascunho inteiro;
3. normalizar e sanitizar dados;
4. resolver URLs públicas de mídia;
5. criar snapshot completo e imutável;
6. persistir `SiteRelease`;
7. atualizar `Site.activeReleaseId` na mesma transação;
8. registrar auditoria;
9. invalidar cache do host;
10. retornar release ativo.

O snapshot contém:

- identidade pública do site;
- tokens do tema;
- cabeçalho, menu e rodapé;
- páginas publicáveis;
- posts publicados ou agendados já vencidos;
- SEO;
- referências de mídia resolvidas;
- nenhuma configuração privada, destinatário de e-mail, membro ou token;
- versão do formato do snapshot.

`apps/sites` nunca mistura release publicado com rascunho. Os fluxos completos estão definidos em `docs/RELEASE_WORKFLOWS.md`.

### 6.4 Restauração

Restaurar não altera release antigo. O snapshot selecionado é convertido em novo estado de rascunho e exige nova publicação.

## 7. Renderização pública

### 7.1 Resolução de host

1. normalizar host e remover porta;
2. rejeitar host inválido;
3. buscar `Domain` ativo;
4. carregar site ativo e release;
5. redirecionar alias para domínio principal;
6. renderizar rota solicitada.

### 7.2 Rotas públicas

- `/` página inicial;
- `/{pageSlug}` páginas;
- `/blog` listagem;
- `/blog/{postSlug}` artigo;
- `/sitemap.xml`;
- `/robots.txt`;
- `/rss.xml`;
- `/404` interna do tema.

Reservar slugs: `admin`, `api`, `app`, `www`, `blog`, `sitemap.xml`, `robots.txt`, `rss.xml`, `preview`, `health`.

### 7.3 Cache

- cache por `host + activeReleaseId + pathname`;
- o release ID torna o cache naturalmente versionado;
- publicação dispara revalidação do host;
- respostas públicas usam cache CDN quando possível;
- preview e formulário nunca usam cache público.

Não adicionar Redis na V1.

## 8. Mídia

Fluxo:

1. cliente envia multipart à API;
2. API valida assinatura real do arquivo, tamanho e dimensões;
3. gera chave aleatória;
4. processa variantes com Sharp;
5. envia ao armazenamento;
6. persiste metadados em transação compensável;
7. retorna `MediaAsset`.

Variantes padrão:

- thumbnail 320 px WebP;
- medium 768 px WebP;
- large 1440 px WebP;
- original normalizado, preservado quando seguro.

Não aumentar imagem menor. Remover metadados EXIF, exceto orientação aplicada.

## 9. Domínios e Caddy

- subdomínios são registros internos ativos automaticamente;
- domínio customizado começa `PENDING`;
- API gera token TXT;
- verificação consulta DNS TXT e valida CNAME/host conforme instrução;
- após verificação, status `VERIFIED` e depois `ACTIVE`;
- Caddy usa On-Demand TLS com endpoint interno de autorização;
- endpoint somente autoriza certificados para domínios `ACTIVE`;
- limitar tentativas para evitar abuso de emissão;
- domínio principal é único por site.

## 10. Jobs internos

A V1 não usa fila externa.

Um scheduler no processo da API, com trava consultiva PostgreSQL, executa:

- publicação de posts agendados a partir de snapshot capturado no agendamento, criando novo SiteRelease baseado no release ativo e sem incluir outros rascunhos;
- expiração de tokens;
- limpeza de uploads incompletos;
- retenção de releases além do limite, sem remover release ativo;
- tentativa limitada de notificação por e-mail.

Jobs devem ser idempotentes. Em múltiplas réplicas, apenas uma executa cada ciclo por advisory lock.

## 11. Observabilidade

- logs JSON em produção;
- request ID propagado;
- níveis `debug`, `info`, `warn`, `error`;
- nunca registrar senha, sessão, reset token, preview token ou conteúdo integral de formulário;
- `/health/live` verifica processo;
- `/health/ready` verifica banco e armazenamento;
- métricas Prometheus ficam para V2; V1 pode registrar contadores essenciais em log.

## 12. Configuração

- variáveis validadas no startup por Zod;
- falhar cedo quando configuração obrigatória faltar;
- `.env.example` sem segredos;
- configurações públicas separadas das privadas;
- nenhum valor sensível em `NEXT_PUBLIC_*`.

## 13. Estratégia de evolução

O formato de bloco e o snapshot possuem `schemaVersion`.

Migrações futuras devem:

- ler versões antigas;
- migrar para a versão atual de forma pura;
- manter testes com fixtures antigas;
- nunca editar releases históricos.

A presença de versionamento não autoriza implementar a V2 durante a V1.
