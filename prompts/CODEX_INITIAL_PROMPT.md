# Prompt inicial para o Codex

Você está iniciando o desenvolvimento do **BlocoSite V1** neste repositório.

Antes de alterar qualquer arquivo:

1. leia `AGENTS.md` integralmente;
2. leia todos os documentos na ordem obrigatória definida nele;
3. trate arquitetura, escopo, stack, blocos e roadmap como congelados;
4. não implemente nenhum item de `docs/V2_NOTES.md`;
5. inspecione o estado atual do repositório;
6. inicie somente a **Fase 0 — Bootstrap do monorepo** de `ROADMAP.md`.

Regras de execução:

- implemente código real, não apenas exemplos;
- não crie arquivos vazios ou placeholders permanentes;
- mantenha TypeScript strict;
- escreva testes junto com a implementação;
- rode lint, typecheck, testes e build;
- corrija os erros encontrados antes de avançar;
- atualize `PROJECT_STATUS.md` com comandos e resultados reais;
- marque a Fase 0 no roadmap apenas depois de todos os gates passarem;
- em seguida, continue sequencialmente pelas fases, sem expandir o escopo;
- não peça para trocar tecnologia ou redesenhar a arquitetura;
- quando uma decisão menor não estiver escrita, escolha a solução mais simples compatível com `AGENTS.md` e registre somente se for relevante;
- alterações após estabilização devem ser correções de erro, segurança ou compatibilidade, sem nova funcionalidade.

Resultado esperado da primeira etapa:

- monorepo pnpm/Turbo funcional;
- `apps/admin`, `apps/api`, `apps/sites` iniciando;
- packages compartilhados configurados;
- Docker Compose com PostgreSQL 18, MinIO e Mailpit;
- validação de ambiente;
- health checks;
- scripts raiz;
- CI inicial;
- documentação de execução conferida;
- todos os comandos do gate da Fase 0 passando.
