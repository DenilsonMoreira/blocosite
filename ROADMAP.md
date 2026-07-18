# ROADMAP.md — Plano de execução sequencial

## Regras

- executar na ordem;
- não iniciar fase seguinte com gate pendente;
- cada fase deve terminar funcional, testada e documentada;
- atualizar `PROJECT_STATUS.md` com comandos e resultados;
- checkboxes só podem ser marcados com evidência real.

## Fase 0 — Bootstrap do monorepo

### Entregas

- [x] pnpm workspace e Turborepo;
- [x] apps `admin`, `api`, `sites`;
- [x] packages oficiais;
- [x] TypeScript strict compartilhado;
- [x] ESLint e Prettier;
- [x] Docker Compose com PostgreSQL, MinIO e Mailpit;
- [x] validação de ambiente;
- [x] health live/ready inicial;
- [x] CI inicial;
- [x] README executável;
- [x] lockfile versionado.

### Gate

- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam;
- serviços de dependência sobem;
- aplicações mostram páginas de saúde sem mocks permanentes.

## Fase 1 — Banco e autenticação

### Entregas

- [ ] schema inicial e migrations;
- [ ] User, Session, tokens e AuditLog;
- [ ] registro;
- [ ] verificação de e-mail;
- [ ] login/logout;
- [ ] recuperação/reset;
- [ ] sessão opaca e CSRF;
- [ ] perfil e sessões;
- [ ] telas acessíveis;
- [ ] e-mails no Mailpit;
- [ ] testes de segurança básicos.

### Gate

Fluxo completo funciona por UI e API; reset revoga sessões; rate limit e CSRF testados.

## Fase 2 — Sites, membros e templates

### Entregas

- [ ] Site, SiteMember, SiteInvitation e Domain subdomain;
- [ ] onboarding;
- [ ] quatro templates seeds;
- [ ] criação transacional;
- [ ] seletor de site;
- [ ] convite de editor;
- [ ] papéis e permissões;
- [ ] dashboard inicial;
- [ ] limites padrão.

### Gate

Owner cria site de cada template; editor acessa somente permissões permitidas; isolamento entre sites testado.

## Fase 3 — Contratos e renderer de blocos

### Entregas

- [ ] registry dos 15 blocos;
- [ ] schemas Zod;
- [ ] defaults e fixtures;
- [ ] renderizadores públicos;
- [ ] tokens de tema;
- [ ] cabeçalho e rodapé;
- [ ] catálogo interno de blocos;
- [ ] testes de renderização e acessibilidade.

### Gate

Todos os blocos renderizam fixtures válidas em desktop/mobile; conteúdo inválido é rejeitado; sem HTML arbitrário.

## Fase 4 — Páginas e editor visual

### Entregas

- [ ] CRUD de páginas;
- [ ] página inicial única;
- [ ] estrutura de três painéis;
- [ ] adicionar/editar/duplicar/ocultar/remover;
- [ ] drag and drop;
- [ ] botões de reordenação;
- [ ] undo/redo;
- [ ] autosave com revisão;
- [ ] conflito 409;
- [ ] preview de dispositivos;
- [ ] validação de links e slugs.

### Gate

Usuário monta uma landing page completa sem código; falha de rede não causa sobrescrita silenciosa; editor funciona no celular.

## Fase 5 — Biblioteca de mídia

### Entregas

- [ ] MediaAsset e migration;
- [ ] upload multipart;
- [ ] magic bytes e limites;
- [ ] Sharp e variantes;
- [ ] MinIO/S3 adapter;
- [ ] biblioteca com busca;
- [ ] seletor de mídia no editor;
- [ ] alt e legenda;
- [ ] quota;
- [ ] exclusão segura;
- [ ] testes maliciosos.

### Gate

Imagem enviada aparece nas variantes e no site; SVG/MIME falso/bomba de dimensão são rejeitados; referências impedem exclusão física.

## Fase 6 — Preview, releases e histórico

### Entregas

- [ ] PreviewToken;
- [ ] preview privado do rascunho inteiro;
- [ ] validador de publicação;
- [ ] SiteRelease snapshot;
- [ ] publicação transacional e idempotente;
- [ ] activeRelease;
- [ ] cache por release;
- [ ] histórico;
- [ ] restauração para rascunho;
- [ ] retenção de releases;
- [ ] auditoria.

### Gate

Rascunho nunca vaza para público; publicação é atômica; duas publicações concorrentes não corrompem; restauração E2E passa.

## Fase 7 — Blog

### Entregas

- [ ] Post e Category;
- [ ] editor TipTap restrito;
- [ ] sanitização;
- [ ] capa e resumo;
- [ ] rascunho/publicado/agendado/arquivado;
- [ ] publicação e retirada individual por release derivado;
- [ ] snapshot imutável no agendamento;
- [ ] cancelamento/atualização de agendamento;
- [ ] job de agendamento;
- [ ] listagem e artigo público;
- [ ] bloco latestPosts;
- [ ] RSS;
- [ ] integração ao release.

### Gate

Publicação individual não inclui outros rascunhos; agendamento usa snapshot capturado, é idempotente e cria release derivado; XSS é sanitizado.

## Fase 8 — Aparência, navegação e SEO

### Entregas

- [ ] tela de aparência;
- [ ] paletas e contraste;
- [ ] fontes e tokens;
- [ ] cabeçalho/rodapé;
- [ ] menu em dois níveis;
- [ ] SEO global e por recurso;
- [ ] Open Graph;
- [ ] sitemap;
- [ ] robots;
- [ ] canonical;
- [ ] 404/500 temáticos;
- [ ] noindex antes do lançamento.

### Gate

Quatro templates têm identidade consistente, navegação mobile e metadados corretos; Lighthouse atende metas.

## Fase 9 — Formulários e mensagens

### Entregas

- [ ] bloco contact completo;
- [ ] FormSubmission criptografado;
- [ ] endpoint público;
- [ ] honeypot, prova temporal e rate limit;
- [ ] Turnstile opcional;
- [ ] painel de mensagens;
- [ ] status lida/arquivada/spam;
- [ ] SMTP e retry interno;
- [ ] retenção configurável;
- [ ] link de aviso de privacidade e consentimento configurável;
- [ ] testes de abuso.

### Gate

Mensagem válida é persistida criptografada e notificada; spam básico é bloqueado; tenant incorreto não lê submissão.

## Fase 10 — Domínio próprio e Caddy

### Entregas

- [ ] CRUD de domínio;
- [ ] normalização/IDNA;
- [ ] token TXT;
- [ ] verificação DNS;
- [ ] principal e aliases;
- [ ] endpoint interno Caddy;
- [ ] configuração Caddy On-Demand TLS;
- [ ] redirects;
- [ ] UI guiada;
- [ ] mocks de DNS nos testes;
- [ ] documentação operacional.

### Gate

Domínio ativo resolve site correto e desconhecido é recusado pelo Caddy; domínio principal redireciona aliases.

## Fase 11 — Administração da plataforma

### Entregas

- [ ] layout separado;
- [ ] usuários e sites;
- [ ] busca;
- [ ] detalhes operacionais;
- [ ] suspensão/reativação;
- [ ] limites;
- [ ] auditoria;
- [ ] configurações não secretas;
- [ ] proteção de papel global.

### Gate

Usuário comum não acessa rotas; suspensão afeta painel/publicação/público conforme especificado; reativação recupera sem perda.

## Fase 12 — Hardening e qualidade

### Entregas

- [ ] cobertura mínima;
- [ ] E2E completos;
- [ ] CSP e headers;
- [ ] secrets scan;
- [ ] auditoria de dependências;
- [ ] logs estruturados;
- [ ] tratamento de erros;
- [ ] jobs com advisory lock;
- [ ] limpeza e retenção;
- [ ] testes de carga leves nos endpoints públicos;
- [ ] revisão multi-tenant.

### Gate

CI verde; nenhuma vulnerabilidade crítica conhecida; checklist de `SECURITY.md` aprovado.

## Fase 13 — Polimento de produto

### Entregas

- [ ] onboarding final;
- [ ] checklist de primeiro site;
- [ ] estados vazio/loading/erro;
- [ ] microcopy pt-BR;
- [ ] navegação por teclado;
- [ ] responsividade 360 px+;
- [ ] reduced motion;
- [ ] acessibilidade axe;
- [ ] Lighthouse;
- [ ] seed de demonstração atraente;
- [ ] revisão dos quatro templates.

### Gate

Uma pessoa sem conhecimento técnico consegue concluir o roteiro de aceitação sem documentação técnica.

## Fase 14 — Release Candidate

### Entregas

- [ ] imagens Docker de produção;
- [ ] compose final;
- [ ] migrations do zero testadas;
- [ ] backup e restauração testados;
- [ ] staging smoke test;
- [ ] documentação final;
- [ ] `.env.example` conferido;
- [ ] termos/placeholders jurídicos identificados;
- [ ] `ACCEPTANCE_CRITERIA.md` integralmente validado;
- [ ] lista V2 sem implementação acidental.

### Gate final

Produto sobe do zero, CI verde, todos os critérios aprovados e nenhum TODO de V1.
