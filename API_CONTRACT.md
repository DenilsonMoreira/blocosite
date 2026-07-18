# API_CONTRACT.md — Contratos da API V1

## 1. Convenções

Base: `/v1`

Content-Type padrão: `application/json`.
Uploads: `multipart/form-data`.

### 1.1 Envelope de sucesso

Objetos únicos podem ser retornados diretamente dentro de `data`.

```json
{
  "data": {},
  "meta": {
    "requestId": "req_..."
  }
}
```

### 1.2 Erro

```json
{
  "error": {
    "code": "PAGE_NOT_FOUND",
    "message": "A página não foi encontrada.",
    "details": {},
    "requestId": "req_..."
  }
}
```

Mensagens são amigáveis; `code` é estável para o cliente.

### 1.3 Paginação

```json
{
  "data": [],
  "page": {
    "nextCursor": "opaque-or-null",
    "hasMore": false
  },
  "meta": { "requestId": "..." }
}
```

### 1.4 Concorrência

Atualizações de rascunho incluem `expectedRevision`. Conflito retorna 409 com revisão atual.

### 1.5 Idempotência

Rotas de publicação e operações críticas aceitam `Idempotency-Key`.

## 2. Autenticação

### `POST /v1/auth/register`

Entrada: nome, e-mail, senha, aceite de termos.
Saída: usuário resumido e indicação de verificação pendente.

### `POST /v1/auth/verify-email`

Entrada: token.
Efeito: verifica e cria sessão.

### `POST /v1/auth/login`

Entrada: e-mail, senha.
Efeito: cria cookie de sessão e retorna usuário.

### `POST /v1/auth/logout`

Revoga sessão atual.

### `POST /v1/auth/forgot-password`

Sempre retorna resposta neutra.

### `POST /v1/auth/reset-password`

Entrada: token e nova senha. Revoga todas as sessões.

### `GET /v1/auth/session`

Retorna usuário, sites acessíveis, CSRF e expiração.

## 3. Usuário

- `GET /v1/me`
- `PATCH /v1/me`
- `POST /v1/me/change-password`
- `POST /v1/me/change-email`
- `DELETE /v1/me`
- `GET /v1/me/sessions`
- `DELETE /v1/me/sessions/:sessionId`

## 4. Sites

- `GET /v1/sites`
- `POST /v1/sites`
- `GET /v1/sites/:siteId`
- `PATCH /v1/sites/:siteId`
- `POST /v1/sites/:siteId/archive`
- `POST /v1/sites/:siteId/restore`

Criação aceita `templateKey` e cria todos os recursos iniciais em transação.

## 5. Membros

- `GET /v1/sites/:siteId/members`
- `POST /v1/sites/:siteId/invitations`
- `DELETE /v1/sites/:siteId/invitations/:invitationId`
- `POST /v1/invitations/:token/accept`
- `DELETE /v1/sites/:siteId/members/:memberId`

Somente owner gerencia membros.

## 6. Configurações, navegação e tema

- `GET /v1/sites/:siteId/draft`
- `PATCH /v1/sites/:siteId/settings/public`
- `PATCH /v1/sites/:siteId/settings/private`
- `PUT /v1/sites/:siteId/navigation`
- `PUT /v1/sites/:siteId/footer`

Mutações públicas exigem `expectedRevision` e retornam nova revisão global do rascunho do site. Configurações privadas possuem contrato separado, nunca são retornadas no preview ou snapshot e exigem permissão apropriada.

## 7. Páginas

- `GET /v1/sites/:siteId/pages`
- `POST /v1/sites/:siteId/pages`
- `GET /v1/sites/:siteId/pages/:pageId`
- `PATCH /v1/sites/:siteId/pages/:pageId`
- `PUT /v1/sites/:siteId/pages/:pageId/content`
- `POST /v1/sites/:siteId/pages/:pageId/duplicate`
- `POST /v1/sites/:siteId/pages/:pageId/archive`
- `POST /v1/sites/:siteId/pages/:pageId/restore`
- `DELETE /v1/sites/:siteId/pages/:pageId`
- `POST /v1/sites/:siteId/pages/:pageId/set-home`

`PUT content` recebe documento completo de blocos e revisão esperada. A API valida tamanho máximo, IDs e schemas.

## 8. Mídia

- `GET /v1/sites/:siteId/media`
- `POST /v1/sites/:siteId/media`
- `GET /v1/sites/:siteId/media/:mediaId`
- `PATCH /v1/sites/:siteId/media/:mediaId`
- `DELETE /v1/sites/:siteId/media/:mediaId`

Upload retorna 201 quando processado ou 202 se processamento assíncrono interno for necessário. A V1 deve preferir processamento síncrono com limites seguros.

## 9. Blog

- `GET /v1/sites/:siteId/posts`
- `POST /v1/sites/:siteId/posts`
- `GET /v1/sites/:siteId/posts/:postId`
- `PATCH /v1/sites/:siteId/posts/:postId`
- `PUT /v1/sites/:siteId/posts/:postId/content`
- `POST /v1/sites/:siteId/posts/:postId/publish`
- `POST /v1/sites/:siteId/posts/:postId/unpublish`
- `POST /v1/sites/:siteId/posts/:postId/schedule`
- `POST /v1/sites/:siteId/posts/:postId/cancel-schedule`
- `POST /v1/sites/:siteId/posts/:postId/archive`
- `POST /v1/sites/:siteId/posts/:postId/restore`
- `DELETE /v1/sites/:siteId/posts/:postId`

Categorias:

- `GET /v1/sites/:siteId/categories`
- `POST /v1/sites/:siteId/categories`
- `PATCH /v1/sites/:siteId/categories/:categoryId`
- `DELETE /v1/sites/:siteId/categories/:categoryId`

## 10. Preview e publicação

### `POST /v1/sites/:siteId/preview-tokens`

Cria preview da revisão atual. Token bruto só aparece uma vez.

### `DELETE /v1/sites/:siteId/preview-tokens/:previewId`

Revoga.

### `POST /v1/sites/:siteId/validate-publication`

Retorna erros e avisos sem publicar.

Os endpoints de publicação individual de artigo também criam `SiteRelease`, seguindo `docs/RELEASE_WORKFLOWS.md`, e não publicam outros rascunhos.

### `POST /v1/sites/:siteId/releases`

Entrada:

```json
{
  "expectedRevision": 12,
  "description": "Atualização da página inicial"
}
```

Exige `Idempotency-Key`. Retorna release criado e domínio público.

### `GET /v1/sites/:siteId/releases`

Lista histórico paginado.

### `GET /v1/sites/:siteId/releases/:releaseId`

Metadados e resumo; snapshot completo somente quando necessário ao owner/editor e com resposta limitada.

### `POST /v1/sites/:siteId/releases/:releaseId/restore`

Converte snapshot em novo rascunho e incrementa revisão.

## 11. Domínios

- `GET /v1/sites/:siteId/domains`
- `POST /v1/sites/:siteId/domains`
- `POST /v1/sites/:siteId/domains/:domainId/verify`
- `POST /v1/sites/:siteId/domains/:domainId/make-primary`
- `DELETE /v1/sites/:siteId/domains/:domainId`

Endpoint interno para Caddy:

- `GET /internal/domains/allow?domain=example.com`

Protegido por rede interna e segredo de serviço. Responde apenas 200 ou 403, sem dados extras.

## 12. Formulários

Público:

- `POST /v1/public/forms/:siteId/:blockId/submissions`

A entrada inclui release ID, campos permitidos, honeypot e prova temporal. A API ignora campos desconhecidos e valida contra configuração do release.

Painel:

- `GET /v1/sites/:siteId/submissions`
- `GET /v1/sites/:siteId/submissions/:submissionId`
- `POST /v1/sites/:siteId/submissions/:submissionId/read`
- `POST /v1/sites/:siteId/submissions/:submissionId/archive`
- `POST /v1/sites/:siteId/submissions/:submissionId/spam`

## 13. Administração da plataforma

Prefixo `/v1/platform` e papel global obrigatório.

- `GET /users`
- `GET /sites`
- `GET /sites/:siteId`
- `POST /sites/:siteId/suspend`
- `POST /sites/:siteId/reactivate`
- `PATCH /sites/:siteId/limits`
- `GET /audit-logs`
- `GET /settings`
- `PATCH /settings`

## 14. Health

- `GET /health/live`
- `GET /health/ready`

Não ficam sob `/v1`.

## 15. Códigos de erro mínimos

- `VALIDATION_ERROR` 400;
- `AUTH_REQUIRED` 401;
- `INVALID_CREDENTIALS` 401;
- `CSRF_INVALID` 403;
- `FORBIDDEN` 403;
- `SITE_ACCESS_DENIED` 403;
- `RESOURCE_NOT_FOUND` 404;
- `SLUG_ALREADY_EXISTS` 409;
- `DRAFT_CONFLICT` 409;
- `IDEMPOTENCY_CONFLICT` 409;
- `PUBLICATION_INVALID` 422;
- `MEDIA_LIMIT_EXCEEDED` 422;
- `DOMAIN_NOT_VERIFIED` 422;
- `RATE_LIMITED` 429;
- `INTERNAL_ERROR` 500;
- `DEPENDENCY_UNAVAILABLE` 503.
