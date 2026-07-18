# SITE_STATES.md — Estados do site e comportamento

## 1. `DRAFT`

Condição:

- site criado, mas ainda sem release ativo.

Painel:

- owner e editor podem editar, preview e publicar;
- onboarding permanece visível.

Público:

- subdomínio retorna página neutra “Site em preparação”;
- status HTTP 200 para permitir validação técnica do domínio, com `noindex, nofollow`;
- não exibe conteúdo do rascunho;
- domínio customizado pode ser configurado, mas só se torna principal após primeira publicação.

## 2. `ACTIVE`

Condição:

- existe release ativo e site não está suspenso ou arquivado.

Painel:

- operações normais conforme papel.

Público:

- renderiza release ativo;
- aliases redirecionam para domínio principal;
- indexação segue configuração do site.

## 3. `SUSPENDED`

Condição:

- ação de `PLATFORM_ADMIN` por motivo operacional, abuso, segurança ou política externa ao código.

Painel:

- owner/editor podem entrar e visualizar conteúdo;
- edição de rascunho é permitida para correção;
- publicação, domínio, convites e novas submissões ficam bloqueados;
- banner mostra suspensão e canal de suporte configurado;
- não apagar ou modificar conteúdo.

Público:

- retorna página genérica “Site temporariamente indisponível”;
- status HTTP 503 com `Retry-After` configurável;
- não revela motivo nem conteúdo privado;
- `noindex`.

## 4. `ARCHIVED`

Condição:

- owner arquivou o site.

Painel:

- site aparece em área de arquivados;
- somente owner pode restaurar;
- edição e publicação ficam bloqueadas enquanto arquivado;
- domínios customizados deixam de ser autorizados para novos certificados.

Público:

- retorna 404 genérico;
- subdomínio fica reservado durante período de retenção;
- release e mídia permanecem para restauração até exclusão definitiva.

## 5. Exclusão lógica

Após confirmação do owner:

- site é arquivado imediatamente;
- sessões não são revogadas globalmente, mas permissões daquele site deixam de valer;
- previews são revogados;
- domínios são desativados;
- exclusão física segue política operacional e backup;
- nome de subdomínio não é liberado automaticamente antes do fim da retenção.

## 6. Transições permitidas

```text
DRAFT ──publicar──> ACTIVE
DRAFT ──arquivar──> ARCHIVED
ACTIVE ──arquivar──> ARCHIVED
ACTIVE ──suspender──> SUSPENDED
DRAFT ──suspender──> SUSPENDED
SUSPENDED ──reativar──> DRAFT ou ACTIVE conforme existência de release
ARCHIVED ──restaurar──> DRAFT ou ACTIVE conforme existência de release
```

A API deve rejeitar transições não listadas.
