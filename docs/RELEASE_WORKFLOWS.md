# RELEASE_WORKFLOWS.md — Fluxos de publicação sem ambiguidade

## 1. Princípio

Toda mudança pública é representada por um novo `SiteRelease`. O site público nunca consulta rascunhos diretamente.

Existem três formas de criar release na V1:

1. publicação completa do site;
2. publicação ou retirada de um artigo individual;
3. publicação agendada de artigo.

Todas usam o mesmo snapshot, validação, auditoria, idempotência e troca atômica de `activeReleaseId`.

## 2. Revisões

- cada página possui `draftRevision` para concorrência do editor;
- cada post possui `draftRevision`;
- o site possui `draftRevision` global;
- toda mutação que pode afetar uma publicação incrementa também `Site.draftRevision` na mesma transação;
- publicação completa exige a revisão global esperada;
- publicação individual de artigo exige a revisão do post e considera o release ativo no início da transação.

## 3. Publicar site completo

Ação: botão **Publicar site**.

Inclui:

- identidade e tema atuais;
- cabeçalho, navegação e rodapé atuais;
- todas as páginas ativas do rascunho;
- todos os posts cujo estado editorial é publicado;
- categorias usadas;
- SEO;
- configuração pública dos formulários.

Passos:

1. validar `expectedSiteRevision`;
2. adquirir trava transacional por site;
3. validar todo o rascunho;
4. sanitizar conteúdo;
5. resolver mídia;
6. montar snapshot completo;
7. calcular hash;
8. criar release com trigger `MANUAL_SITE`;
9. ativar release;
10. invalidar cache;
11. auditar.

## 4. Publicar artigo individual

Ação: **Publicar artigo** dentro do editor de post.

Objetivo: publicar o artigo sem levar ao ar alterações ainda incompletas de páginas, tema, menu ou outros artigos.

Passos:

1. validar revisão do post;
2. carregar o release ativo;
3. validar e sanitizar somente o artigo e dependências;
4. copiar o snapshot ativo;
5. inserir ou substituir o artigo no snapshot;
6. atualizar categorias e índices derivados;
7. criar release com trigger `MANUAL_POST` e `baseReleaseId` apontando para o release anterior;
8. ativar atomically;
9. marcar estado editorial do post como `PUBLISHED` e `publishedAt`;
10. invalidar cache e auditar.

Alterações de rascunho em outras áreas não entram nesse release.

## 5. Retirar artigo do ar

Ação: **Retirar do ar**.

- carrega release ativo;
- remove o artigo do snapshot e recalcula listagens;
- cria release `MANUAL_POST`;
- marca post como `DRAFT` ou `ARCHIVED`, conforme ação escolhida;
- não apaga o rascunho.

## 6. Agendar artigo

Ao agendar:

1. validar e sanitizar o artigo atual;
2. criar `scheduledSnapshot` imutável dentro do registro do post;
3. salvar `scheduledSnapshotHash`, `scheduledFor`, `scheduledById` e revisão de origem;
4. estado vira `SCHEDULED`.

Edições posteriores no rascunho não alteram silenciosamente o conteúdo agendado. A UI mostra que existe uma versão agendada e oferece:

- atualizar o agendamento com o rascunho atual;
- cancelar agendamento;
- continuar editando uma futura versão.

No horário:

1. job obtém advisory lock;
2. seleciona posts vencidos com `FOR UPDATE SKIP LOCKED`;
3. carrega release ativo mais recente;
4. mescla o `scheduledSnapshot` do post;
5. cria release `SCHEDULED_POST`;
6. ativa release;
7. marca post `PUBLISHED`, limpa campos de agendamento e registra `publishedAt`;
8. envia evento de invalidação de cache;
9. registra auditoria.

Assim, o artigo agendado entra no ar sem publicar outros rascunhos existentes.

## 7. Cancelar agendamento

- limpa snapshot e horário agendados;
- estado volta para `DRAFT`, salvo se já houver versão pública anterior, caso em que o estado editorial pode permanecer `PUBLISHED` com rascunho novo;
- não cria release.

## 8. Restauração

Restaurar release:

- converte snapshot selecionado em rascunho completo;
- incrementa revisão global e revisões dos recursos recriados;
- não muda o público;
- nova publicação completa cria release trigger `ROLLBACK` com `baseReleaseId` referenciando a origem restaurada.

## 9. Estados editoriais do post

Para evitar confundir estado público e rascunho:

- `DRAFT`: não existe versão pública no release ativo;
- `PUBLISHED`: existe versão pública, podendo haver rascunho mais novo;
- `SCHEDULED`: existe snapshot agendado; pode ou não existir versão pública anterior;
- `ARCHIVED`: não aparece no rascunho comum e não deve estar no próximo release completo.

A UI deve indicar separadamente:

- “Publicado”;
- “Alterações não publicadas”;
- “Agendado para…”;
- “Fora do ar”.

## 10. Falhas

- falha antes de ativar release não altera o público;
- falha de invalidação de cache não desfaz release, mas gera retry e cache versionado pelo release reduz risco;
- falha de e-mail nunca afeta publicação;
- idempotency key repetida com mesmo corpo retorna resultado anterior;
- mesma chave com corpo diferente retorna conflito;
- dois jobs não publicam o mesmo agendamento devido a locks e marcação transacional.
