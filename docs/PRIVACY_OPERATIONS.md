# PRIVACY_OPERATIONS.md — Privacidade e operação de dados

Este documento define requisitos de produto e operação. Não substitui revisão jurídica dos termos, política de privacidade, contratos ou bases legais aplicáveis.

## 1. Dados tratados pela plataforma

### Conta

- nome;
- e-mail;
- credencial protegida;
- sessões e metadados antifraude minimizados;
- sites e conteúdo criado.

### Formulários dos sites

- campos configurados pelo proprietário do site;
- data, site, página e bloco de origem;
- hashes minimizados para controle de abuso;
- status operacional da mensagem.

### Operação

- logs técnicos;
- auditoria de ações críticas;
- domínios e verificações;
- limites e status do site.

## 2. Princípios de implementação

- coletar somente o necessário;
- deixar finalidade clara na interface;
- limitar acesso por papel;
- criptografar submissões;
- definir retenção;
- permitir correção e encerramento de conta;
- não vender ou compartilhar dados como requisito do produto;
- não usar submissões dos clientes para treino, publicidade ou analytics na V1;
- não registrar conteúdo sensível em logs.

## 3. Papéis operacionais

A relação jurídica real depende do modelo comercial e deve ser revisada. Tecnicamente:

- o proprietário do site define os campos e a finalidade do formulário;
- a plataforma processa e armazena os dados conforme configuração;
- o administrador da plataforma acessa apenas metadados operacionais por padrão;
- owners e editors autorizados podem ler mensagens do próprio site.

A UI e os termos não devem declarar papéis jurídicos definitivos sem revisão profissional.

## 4. Aviso de privacidade do site

A V1 permite:

- criar uma página normal de política/aviso;
- configurar `privacyNoticeUrl` no site;
- mostrar link próximo ao formulário;
- configurar texto de consentimento quando o proprietário determinar que ele é necessário;
- manter consentimento desmarcado por padrão.

Os templates podem criar uma página de rascunho “Política de Privacidade — revisar antes de publicar” com placeholders evidentes, mas não devem publicar texto jurídico genérico automaticamente.

## 5. Cookies

A V1 usa cookie essencial de sessão apenas no painel. Sites públicos não instalam analytics, pixel de marketing ou cookie não essencial.

Preview pode usar cookie estritamente necessário para autorização temporária.

Como não há analytics/marketing na V1, não implementar banner genérico de cookies. Caso uma implantação acrescente scripts externos fora do escopo, a responsabilidade de consentimento deve ser tratada antes do uso.

## 6. Retenção

Defaults configuráveis:

- submissões: 365 dias;
- audit logs: 730 dias;
- sessões expiradas/revogadas: limpeza após janela operacional;
- tokens expirados: limpeza periódica;
- site arquivado: manter até exclusão solicitada e período operacional definido;
- backups seguem retenção própria e expiram por ciclo.

A UI deve informar a retenção de mensagens ao owner.

## 7. Solicitações de titular e suporte

A V1 deve permitir operação manual segura para:

- localizar dados por e-mail ou identificador fornecido;
- corrigir dados de conta;
- encerrar conta;
- excluir ou anonimizar submissão específica quando solicitado e autorizado;
- registrar a ação em audit log sem repetir o dado removido.

Exportação self-service completa fica para V2. Não prometer automação que a V1 não possui.

## 8. Exclusão de conta e site

- encerramento não apaga imediatamente backups;
- revogar sessões e previews;
- desativar domínios;
- remover publicação pública;
- agendar exclusão lógica/física conforme política operacional;
- preservar apenas registros legalmente necessários, quando definidos por política revisada;
- mostrar claramente o efeito antes da confirmação.

## 9. Incidentes

A operação deve manter um procedimento documentado para:

- identificar escopo;
- conter acesso;
- preservar evidências;
- rotacionar segredos;
- restaurar serviço;
- avaliar comunicações necessárias com apoio jurídico;
- registrar lições e correções.

O código deve facilitar investigação por request ID e audit logs, sem guardar conteúdo sensível desnecessário.

## 10. Checklist antes de produção

- política da plataforma revisada;
- termos de uso revisados;
- contato de privacidade definido;
- retenções configuradas;
- processo de solicitação de titular definido;
- contrato com provedor de e-mail/armazenamento revisado;
- backups e acesso administrativo revisados;
- página de privacidade dos templates claramente marcada como rascunho;
- formulários mostram finalidade e link quando configurado.
