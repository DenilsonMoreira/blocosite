# Docker — alvo da implementação

A Fase 0 deve criar Dockerfiles de desenvolvimento e a Fase 14 deve finalizá-los para produção.

Requisitos:

- builds multi-stage;
- usuário não root;
- imagens compatíveis com Node 24 LTS;
- dependências instaladas com lockfile congelado;
- healthchecks;
- sem `.env` ou fonte desnecessária na imagem final;
- migrations executadas em job separado;
- volumes somente para dados persistentes.
