# PERMISSIONS_MATRIX.md — Matriz de autorização V1

## 1. Papéis

- `OWNER`: proprietário do site;
- `EDITOR`: colaborador de conteúdo;
- `PLATFORM_ADMIN`: administrador operacional global;

`PLATFORM_ADMIN` não ganha acesso ao conteúdo privado de um site automaticamente. Para atuar como membro, precisa de associação explícita, salvo metadados operacionais definidos abaixo.

## 2. Matriz

| Ação | OWNER | EDITOR | PLATFORM_ADMIN global |
|---|---:|---:|---:|
| Ver dashboard do site | Sim | Sim | Metadados operacionais somente |
| Editar páginas e blocos | Sim | Sim | Não |
| Criar/editar artigos | Sim | Sim | Não |
| Publicar site | Sim | Sim | Não |
| Publicar/agendar artigo | Sim | Sim | Não |
| Restaurar release | Sim | Sim | Não |
| Gerenciar mídia | Sim | Sim | Não |
| Ler mensagens do formulário | Sim | Sim | Não por padrão |
| Marcar/arquivar mensagem | Sim | Sim | Não |
| Editar aparência/menu/rodapé | Sim | Sim | Não |
| Alterar nome interno e configurações básicas | Sim | Não | Não |
| Convidar/remover membros | Sim | Não | Não |
| Gerenciar domínios | Sim | Não | Estado operacional somente |
| Arquivar/excluir site | Sim | Não | Suspender/reativar |
| Alterar limites | Não | Não | Sim |
| Suspender/reativar site | Não | Não | Sim |
| Ver audit log do próprio site | Sim | Não | Sim, metadados |
| Alterar configurações globais | Não | Não | Sim |

## 3. Regras adicionais

- o último owner não pode ser removido;
- V1 não permite transferir propriedade;
- editor pode publicar porque o papel representa confiança editorial completa;
- ações destrutivas de site, membro e domínio exigem owner;
- platform admin não descriptografa submissões por padrão;
- nenhuma decisão de UI substitui verificação na API;
- rotas retornam 404 quando revelar a existência do recurso criaria vazamento entre tenants, e 403 quando o recurso e o contexto já são conhecidos de forma legítima.
