# DATA_MODEL.md — Modelo de dados lógico

## 1. Convenções

- PostgreSQL 18;
- nomes de tabelas em `snake_case` via mapeamento Prisma;
- habilitar extensão `citext` na primeira migration;
- IDs UUID;
- timestamps `timestamptz` em UTC;
- `createdAt` e `updatedAt` quando o registro é mutável;
- `deletedAt` para exclusão lógica;
- enums no banco apenas para estados estáveis;
- JSONB para conteúdo estruturado validado por schema, nunca para esconder relacionamentos essenciais;
- índices explícitos para chaves de busca e filtros;
- unicidade sempre no escopo correto do tenant.

## 2. Entidades

### 2.1 User

- `id` UUID PK;
- `name` varchar(120);
- `email` citext unique;
- `passwordHash` text;
- `emailVerifiedAt` timestamptz nullable;
- `globalRole` enum `USER | PLATFORM_ADMIN`;
- `status` enum `ACTIVE | SUSPENDED | CLOSED`;
- `timezone` varchar default `America/Fortaleza`;
- `lastLoginAt`;
- timestamps;
- `deletedAt`.

### 2.2 Session

- `id` UUID PK;
- `userId` FK;
- `tokenHash` char(64) unique;
- `csrfSecretHash` char(64);
- `userAgentHash` nullable;
- `ipHash` nullable;
- `lastSeenAt`;
- `expiresAt`;
- `revokedAt` nullable;
- `createdAt`.

Índices: `userId`, `expiresAt`, `tokenHash`.

### 2.3 EmailVerificationToken

- `id` UUID;
- `userId`;
- `tokenHash` unique;
- `expiresAt`;
- `usedAt`;
- `createdAt`.

### 2.4 PasswordResetToken

Mesmo padrão do token de verificação. Um reset bem-sucedido revoga todas as sessões.

### 2.5 Site

- `id` UUID;
- `ownerId` FK User;
- `internalName` varchar(120);
- `publicName` varchar(160);
- `segment` varchar(80) nullable;
- `locale` `pt-BR` na V1;
- `timezone` varchar;
- `status` enum `DRAFT | ACTIVE | SUSPENDED | ARCHIVED`;
- `subdomain` citext unique;
- `draftRevision` integer default 1;
- `draftPublicSettings` JSONB;
- `privateSettings` JSONB;
- `draftNavigation` JSONB;
- `draftFooter` JSONB;
- `activeReleaseId` nullable;
- `noIndex` boolean default true até primeira publicação;
- `limitsOverride` JSONB nullable;
- timestamps;
- `deletedAt`.

`draftPublicSettings`, `privateSettings`, `draftNavigation` e `draftFooter` seguem schemas separados em `packages/contracts`. `privateSettings` nunca entra no snapshot público e guarda, por exemplo, destinatários de formulário.

### 2.6 SiteMember

- `id` UUID;
- `siteId`;
- `userId`;
- `role` enum `OWNER | EDITOR`;
- `invitedById` nullable;
- `acceptedAt`;
- timestamps.

Unique `(siteId, userId)`.

O proprietário também deve possuir registro `SiteMember OWNER` para consultas uniformes.

### 2.7 SiteInvitation

- `id` UUID;
- `siteId`;
- `email` citext;
- `role` somente `EDITOR` na V1;
- `tokenHash`;
- `invitedById`;
- `expiresAt`;
- `acceptedAt`;
- `revokedAt`;
- `createdAt`.

### 2.8 Page

- `id` UUID;
- `siteId`;
- `title` varchar(160);
- `slug` citext;
- `isHome` boolean;
- `status` enum `ACTIVE | ARCHIVED`;
- `sortOrder` integer;
- `draftRevision` integer;
- `draftContent` JSONB contendo array de blocos;
- `draftSeo` JSONB;
- `lastEditedById`;
- timestamps;
- `deletedAt`.

Unique parcial lógico `(siteId, slug)` para registros não excluídos.
Apenas uma página `isHome=true` por site, garantida por transação e índice parcial em migration SQL quando necessário.

### 2.9 Post

- `id` UUID;
- `siteId`;
- `authorId`;
- `categoryId` nullable;
- `title` varchar(180);
- `slug` citext;
- `summary` varchar(400);
- `coverMediaId` nullable;
- `status` enum `DRAFT | SCHEDULED | PUBLISHED | ARCHIVED`;
- `scheduledFor` nullable;
- `scheduledSnapshot` JSONB nullable;
- `scheduledSnapshotHash` char(64) nullable;
- `scheduledSourceRevision` integer nullable;
- `scheduledById` nullable;
- `publishedAt` nullable;
- `draftRevision` integer;
- `draftContent` JSONB TipTap;
- `draftSeo` JSONB;
- timestamps;
- `deletedAt`.

Unique `(siteId, slug)` entre não excluídos.

### 2.10 Category

- `id` UUID;
- `siteId`;
- `name` varchar(80);
- `slug` citext;
- timestamps.

Unique `(siteId, slug)`.

### 2.11 MediaAsset

- `id` UUID;
- `siteId`;
- `uploadedById`;
- `title` varchar(160);
- `originalFilename` varchar(255);
- `storagePrefix` text unique;
- `mimeType` enum lógico `image/jpeg | image/png | image/webp`;
- `sizeBytes` bigint;
- `width` integer;
- `height` integer;
- `altText` varchar(300) nullable;
- `caption` varchar(500) nullable;
- `variants` JSONB;
- `status` enum `PROCESSING | READY | FAILED | DELETED`;
- `checksumSha256` char(64);
- timestamps;
- `deletedAt`.

Índices: `(siteId, createdAt desc)`, `(siteId, status)`.

### 2.12 SiteRelease

- `id` UUID;
- `siteId`;
- `number` integer;
- `schemaVersion` integer;
- `snapshot` JSONB;
- `contentHash` char(64);
- `description` varchar(240) nullable;
- `trigger` enum `MANUAL_SITE | MANUAL_POST | SCHEDULED_POST | ROLLBACK`;
- `baseReleaseId` nullable FK para release anterior/origem;
- `createdById`;
- `createdAt`;
- `activatedAt`;
- `isRollbackSource` boolean default false.

Unique `(siteId, number)` e `(siteId, contentHash)` quando idempotência permitir reaproveitamento.

Release é imutável. Não possui `updatedAt`.

### 2.13 PreviewToken

- `id` UUID;
- `siteId`;
- `createdById`;
- `tokenHash` unique;
- `draftRevision` integer;
- `expiresAt`;
- `revokedAt`;
- `createdAt`.

### 2.14 Domain

- `id` UUID;
- `siteId`;
- `hostname` citext unique;
- `type` enum `SUBDOMAIN | CUSTOM`;
- `status` enum `PENDING | VERIFYING | VERIFIED | ACTIVE | FAILED | DISABLED`;
- `isPrimary` boolean;
- `verificationTokenHash` nullable;
- `verificationTokenCreatedAt` nullable;
- `lastCheckedAt`;
- `verifiedAt`;
- `activatedAt`;
- `failureReasonCode` nullable;
- timestamps.

Apenas um domínio primário ativo por site.

### 2.15 FormSubmission

- `id` UUID;
- `siteId`;
- `releaseId`;
- `pageSlug`;
- `blockId` UUID lógico do bloco;
- `payloadEnvelope` JSONB com `version`, `keyId`, `iv`, `ciphertext` e `authTag` em base64;
- `emailNormalizedHash` nullable para controle de abuso;
- `ipHash` nullable;
- `userAgentHash` nullable;
- `status` enum `NEW | READ | ARCHIVED | SPAM`;
- `createdAt`;
- `readAt` nullable;
- `archivedAt` nullable;
- `notificationStatus` enum `PENDING | SENT | FAILED | DISABLED`.

Dados sensíveis do formulário devem ser criptografados em repouso com chave da aplicação. O token de verificação de domínio bruto é retornado apenas na criação/regeneração; o banco guarda somente hash e o TXT recebido é comparado por hash.

### 2.16 AuditLog

- `id` UUID;
- `actorUserId` nullable;
- `siteId` nullable;
- `action` varchar(120);
- `targetType` varchar(80);
- `targetId` nullable;
- `metadata` JSONB com dados não sensíveis;
- `requestId` varchar(80);
- `ipHash` nullable;
- `createdAt`.

Sem `updatedAt`. Retenção configurável.

### 2.17 IdempotencyKey

- `id` UUID;
- `scope` varchar(120);
- `keyHash` char(64);
- `userId` nullable;
- `siteId` nullable;
- `requestHash` char(64);
- `responseStatus` integer;
- `responseBody` JSONB;
- `expiresAt`;
- `createdAt`.

Unique `(scope, keyHash)`.

### 2.18 PlatformSetting

- `key` varchar PK;
- `value` JSONB;
- `updatedById`;
- `updatedAt`.

Usado apenas para limites e configurações operacionais não secretas.

## 3. Relações principais

```text
User 1 ── N Site (owner)
User N ── N Site via SiteMember
Site 1 ── N Page
Site 1 ── N Post
Site 1 ── N MediaAsset
Site 1 ── N Domain
Site 1 ── N SiteRelease
Site 1 ── N FormSubmission
Site 1 ── 1 active SiteRelease
Post N ── 0..1 Category
```

## 4. JSON schemas obrigatórios

Todos devem possuir `schemaVersion`.

- `SiteDraftPublicSettings`;
- `SitePrivateSettings`;
- `NavigationConfig`;
- `FooterConfig`;
- `PageBlockDocument`;
- `PageSeo`;
- `PostSeo`;
- `MediaVariants`;
- `SiteReleaseSnapshot`;
- `FormPayload` por configuração de bloco.

Os schemas ficam em `packages/contracts` ou `packages/blocks` e são validados antes de persistir e após ler dados legados.

## 5. Snapshot de release

Estrutura lógica resumida:

```json
{
  "schemaVersion": 1,
  "site": {
    "publicName": "Empresa Exemplo",
    "locale": "pt-BR",
    "timezone": "America/Fortaleza",
    "theme": {},
    "navigation": {},
    "footer": {},
    "seoDefaults": {}
  },
  "pages": [
    {
      "id": "uuid",
      "title": "Início",
      "slug": "",
      "isHome": true,
      "seo": {},
      "blocks": []
    }
  ],
  "posts": [],
  "categories": [],
  "generatedAt": "2026-07-18T00:00:00.000Z"
}
```

O snapshot publicado contém somente dados necessários ao site público. Não contém e-mails internos, limites, tokens ou dados de membros.

## 6. Regras de exclusão

- usuário: fechamento lógico;
- site: arquivamento e depois exclusão lógica;
- página/post nunca publicado: pode ser excluído definitivamente após confirmação;
- página/post presente em release: apenas arquivar no rascunho;
- mídia referenciada em rascunho ou release: não remover objeto físico;
- domínio: desativar antes de excluir;
- release: retenção mantém ativo e os N mais recentes; exclusão física apenas por job seguro;
- submissão: arquivar na UI; política de retenção pode apagar após período configurado.

## 7. Transações críticas

Toda mutação de página, post, tema, navegação ou rodapé incrementa `Site.draftRevision` na mesma transação, além da revisão específica do recurso quando existir.

Usar transação explícita para:

- criação de site + owner member + subdomínio + template;
- alteração de página inicial;
- convite aceito;
- publicação do site;
- restauração de release;
- troca de domínio principal;
- suspensão de site e revogação de previews;
- redefinição de senha e revogação de sessões.
