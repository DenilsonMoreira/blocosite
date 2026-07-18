# DECISIONS.md — Registro de decisões congeladas

## D-001 — Produto controlado por blocos

**Status:** Aceita e congelada.

O editor não será livre como ferramenta de design. Usuários montam páginas com blocos responsivos e opções limitadas. Isso reduz suporte, quebra de layout e risco de segurança.

## D-002 — Monorepo TypeScript

**Status:** Aceita e congelada.

Toda a aplicação usa TypeScript em monorepo pnpm. Contratos, blocos e tipos são compartilhados sem duplicação manual.

## D-003 — Três aplicações

**Status:** Aceita e congelada.

- admin Next.js;
- API Fastify;
- sites Next.js.

Não unir tudo em uma aplicação única nem decompor em microserviços na V1.

## D-004 — PostgreSQL e Prisma

**Status:** Aceita e congelada.

PostgreSQL 18 e Prisma ORM 6. Migrations versionadas são obrigatórias. JSONB é usado apenas para conteúdo estruturado validado.

## D-005 — Release atômico do site inteiro

**Status:** Aceita e congelada.

O público lê snapshot imutável. Rascunhos não aparecem antes da publicação. Toda publicação cria um release e troca o ativo atomicamente.

## D-006 — Sem Redis na V1

**Status:** Aceita e congelada.

Cache usa recursos do Next, HTTP/CDN e release ID. Jobs usam advisory lock PostgreSQL. Redis pode ser avaliado na V2.

## D-007 — Sessão opaca, sem JWT no navegador

**Status:** Aceita e congelada.

Cookie HttpOnly contém token opaco; banco guarda hash. CSRF é obrigatório em mutações.

## D-008 — MinIO/S3

**Status:** Aceita e congelada.

Interface S3 compatível permite desenvolvimento local e troca de provedor em produção sem alterar domínio da aplicação.

## D-009 — Imagens, não arquivos genéricos

**Status:** Aceita e congelada.

V1 aceita JPEG, PNG e WebP. SVG, vídeo e documentos ficam fora para reduzir risco e complexidade.

## D-010 — Caddy para domínios

**Status:** Aceita e congelada.

Caddy gerencia proxy e TLS. On-Demand TLS só autoriza domínios ativos por endpoint interno.

## D-011 — UI pt-BR

**Status:** Aceita e congelada.

Painel somente em português do Brasil na V1. A arquitetura não deve assumir textos espalhados de forma impossível de internacionalizar, mas não implementar i18n completo.

## D-012 — Quatro templates

**Status:** Aceita e congelada.

Serviços Profissionais, Restaurante e Café, Portfólio Pessoal, Blog e Criador. Novos templates ficam para V2.

## D-013 — Quinze blocos

**Status:** Aceita e congelada.

Tipos definidos em `BLOCKS_SPEC.md`. Não adicionar bloco extra na V1. Cabeçalho e rodapé são globais.

## D-014 — TipTap apenas para texto rico

**Status:** Aceita e congelada.

Artigos e bloco richText usam subset sanitizado do TipTap. O layout da página continua baseado em blocos.

## D-015 — Sem código personalizado

**Status:** Aceita e congelada.

Nenhum HTML/CSS/JS customizado, iframe arbitrário ou plugin. Vídeo aceita somente YouTube/Vimeo validados.

## D-016 — Formulário predefinido

**Status:** Aceita e congelada.

Campos são selecionados de catálogo fixo. Não existe construtor genérico de formulários.

## D-017 — Dados de formulário criptografados

**Status:** Aceita e congelada.

Payload é criptografado em repouso. Logs e e-mails evitam exposição desnecessária.

## D-018 — Sem billing na V1

**Status:** Aceita e congelada.

Planos e limites existem operacionalmente, mas pagamentos, assinatura e cobrança automática ficam para V2.

## D-019 — Platform admin mínimo

**Status:** Aceita e congelada.

Permite suporte operacional, limites e suspensão. Impersonação e edição invisível do cliente não serão implementadas.

## D-020 — Jobs internos com advisory lock

**Status:** Aceita e congelada.

Não usar fila externa. Jobs leves são idempotentes e coordenados pelo PostgreSQL.

## D-021 — Autosave com revisão otimista

**Status:** Aceita e congelada.

Rascunho possui revisão. Conflitos retornam 409, evitando sobrescrita silenciosa.

## D-022 — Acessibilidade como requisito

**Status:** Aceita e congelada.

Fluxos principais e sites gerados devem atingir WCAG 2.2 AA de forma razoável e verificável.

## D-023 — Arquitetura não muda após início

**Status:** Aceita e congelada.

Mudanças futuras durante V1 só podem corrigir bug, segurança ou incompatibilidade, preservando escopo e comportamento. Melhorias ficam documentadas para V2.

## Modelo para correções futuras

```text
## D-XXX — Título
Status: Correção necessária
Data: YYYY-MM-DD
Problema comprovado:
Decisão mínima:
Impacto:
Por que não altera o escopo:
Testes adicionados:
```
