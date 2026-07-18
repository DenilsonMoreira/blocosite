# SCOPE_FREEZE.md — Proteção do escopo V1

## 1. Objetivo

Os documentos listados em `docs/scope-freeze.sha256` definem o produto e a arquitetura aprovados antes do início da implementação. O arquivo de checksums ajuda a detectar alterações acidentais ou expansão silenciosa de escopo.

## 2. Verificação

```bash
./scripts/verify-scope-freeze.sh
```

O comando deve passar antes de iniciar uma fase e após concluí-la.

## 3. Arquivos mutáveis

Estes arquivos podem mudar normalmente durante a execução:

- `ROADMAP.md`, apenas checkboxes e evidências coerentes;
- `PROJECT_STATUS.md`;
- `DECISIONS.md`, somente para acrescentar correção necessária;
- `README.md`, quando os comandos reais forem implementados;
- código, migrations, testes e configuração de implantação.

## 4. Correção legítima de especificação

Uma especificação congelada só pode mudar quando existir erro comprovado de:

- segurança;
- incompatibilidade técnica real;
- contradição interna que impeça implementação;
- requisito impossível de testar ou operar como escrito.

Procedimento obrigatório:

1. registrar uma decisão `D-XXX` em `DECISIONS.md` com problema e correção mínima;
2. alterar somente o necessário;
3. adicionar teste que demonstre o problema corrigido;
4. regenerar `docs/scope-freeze.sha256` com `scripts/regenerate-scope-freeze.sh`;
5. registrar a ação em `PROJECT_STATUS.md`.

Não usar esse procedimento para adicionar melhoria, preferência, refactor estético ou item da V2.
