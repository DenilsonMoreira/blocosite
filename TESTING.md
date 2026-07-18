# TESTING.md — Estratégia de qualidade

## 1. Pirâmide

- muitos testes unitários rápidos;
- integração real com PostgreSQL e armazenamento local;
- E2E apenas para fluxos de negócio críticos;
- testes manuais guiados para domínio/TLS e responsividade final.

## 2. Ferramentas

- Vitest;
- Testing Library para componentes;
- Fastify `inject` para API;
- banco PostgreSQL isolado de teste;
- MinIO de teste;
- Playwright;
- axe-core/Playwright para acessibilidade;
- fake SMTP ou Mailpit para integração.

## 3. Regras

- testes não dependem de ordem;
- dados são criados por factories;
- relógio é controlável;
- nenhum teste usa serviço externo real;
- E2E deve poder rodar em CI com Docker;
- flakiness é defeito e deve ser corrigida, não mascarada com retries excessivos;
- cobertura numérica não substitui cenários, mas metas mínimas orientam lacunas.

## 4. Metas mínimas

- packages de contratos/blocos/utils: 90% linhas;
- services críticos da API: 85%;
- projeto total: 80%;
- autenticação, autorização, publicação e domínio: branches críticos cobertos explicitamente.

## 5. Unitários obrigatórios

- slug e palavras reservadas;
- normalização de hostname;
- validadores de URL;
- schemas de todos os blocos;
- migração de schema de bloco;
- sanitização TipTap;
- cálculo de limites;
- políticas de papéis;
- geração e hash de tokens;
- envelope de criptografia de formulário;
- geração do snapshot;
- hash de conteúdo;
- regras de validação da publicação;
- parsing de cores e contraste;
- transformação de template em rascunho.

## 6. Integração obrigatória

### Autenticação

- registro;
- verificação;
- login válido e inválido;
- rate limit;
- reset;
- rotação/revogação de sessão;
- CSRF.

### Tenancy

Criar usuários A e B com sites diferentes e provar que A não lê, edita, publica, apaga ou baixa mídia de B.

### Site e conteúdo

- criação transacional por template;
- unicidade de subdomínio e slug;
- controle otimista de revisão;
- página inicial única;
- arquivamento e restauração.

### Mídia

- upload válido;
- MIME falso;
- excesso de tamanho/dimensão;
- variantes;
- metadados removidos;
- limite por site;
- exclusão com referência.

### Publicação

- validação com erro;
- publicação válida;
- idempotência;
- concorrência;
- snapshot imutável;
- troca atômica do release;
- restauração;
- retenção sem apagar ativo.

### Blog

- rascunho;
- agendamento;
- job idempotente;
- RSS e sitemap do release.

### Formulário

- submissão válida;
- campo desconhecido;
- honeypot;
- tempo mínimo;
- rate limit;
- payload criptografado;
- leitura autorizada;
- notificação SMTP.

### Domínio

- normalização;
- TXT correto/incorreto;
- ativação;
- domínio principal único;
- endpoint Caddy autoriza somente ativo.

## 7. E2E obrigatório

1. **Primeiro site**: registrar, verificar, onboarding, editar hero, enviar imagem, preview, publicar e abrir subdomínio.
2. **Edição segura**: alterar página publicada, confirmar que público não muda antes de publicar, publicar e verificar mudança.
3. **Restauração**: publicar duas versões, restaurar a primeira para rascunho e republicar.
4. **Blog**: criar categoria e artigo, publicar, acessar listagem e RSS.
5. **Contato**: visitante envia formulário, owner recebe mensagem no painel e e-mail no Mailpit.
6. **Membro editor**: owner convida, editor aceita e edita; editor é bloqueado em domínio/membros.
7. **Mobile**: editar bloco com viewport móvel e publicar.
8. **Domínio**: fluxo com resolvedor DNS mockado e autorização Caddy.
9. **Suspensão**: platform admin suspende site; painel e público exibem comportamento definido.
10. **Acessibilidade**: axe sem violações críticas nas páginas principais.

## 8. Testes de renderização pública

Fixtures para os quatro templates devem testar:

- todas as rotas;
- metadados;
- 404;
- menu mobile;
- imagens responsivas;
- links externos;
- carrossel por teclado;
- `prefers-reduced-motion`;
- HTML sem scripts injetados.

## 9. Performance

Em ambiente de referência local/CI:

- página pública sem mídia pesada deve responder rapidamente após cache aquecido;
- snapshot não deve exigir N+1;
- bundle do site público deve evitar código do editor;
- imagens devem usar variantes adequadas;
- upload deve respeitar memória.

Antes do RC, executar Lighthouse em um site seed e registrar resultados. Metas:

- Performance >= 85 mobile;
- Accessibility >= 95;
- Best Practices >= 90;
- SEO >= 95.

Resultados variam por ambiente, mas regressões claras devem ser corrigidas.

## 10. Comandos

- `pnpm test` unitários;
- `pnpm test:integration` integração;
- `pnpm test:e2e` E2E;
- `pnpm test:coverage` cobertura;
- `pnpm check` lint + typecheck + unitários;
- `pnpm ci` validação completa adequada ao CI.
