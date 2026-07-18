# ACCEPTANCE_CRITERIA.md — Critérios finais verificáveis

## 1. Instalação

- [ ] clone limpo funciona seguindo README;
- [ ] `.env.example` contém todas as variáveis sem segredo real;
- [ ] migrations aplicam em PostgreSQL vazio;
- [ ] seed pode rodar duas vezes sem duplicação incorreta;
- [ ] `pnpm dev` inicia as três aplicações;
- [ ] `pnpm build` gera artefatos de produção.

## 2. Conta

- [ ] usuário registra, verifica e-mail, entra e sai;
- [ ] senha inválida não revela detalhes;
- [ ] reset funciona uma vez e expira;
- [ ] troca de senha revoga sessões;
- [ ] CSRF bloqueia mutação inválida;
- [ ] sessões podem ser listadas e revogadas.

## 3. Sites e permissões

- [ ] owner cria vários sites dentro do limite;
- [ ] quatro templates funcionam;
- [ ] subdomínio é único;
- [ ] owner convida editor;
- [ ] editor edita conteúdo;
- [ ] editor não gerencia domínio, membros ou limites;
- [ ] tenant A não acessa tenant B por nenhuma rota testada.

## 4. Editor

- [ ] todos os 15 blocos podem ser adicionados;
- [ ] propriedades são editáveis;
- [ ] reordenação funciona por drag e botões;
- [ ] duplicar, ocultar e remover funcionam;
- [ ] undo/redo funciona;
- [ ] autosave exibe estado;
- [ ] conflito de revisão não sobrescreve silenciosamente;
- [ ] preview desktop/tablet/mobile funciona;
- [ ] editor é utilizável em viewport móvel.

## 5. Mídia

- [ ] JPEG/PNG/WebP válidos são processados;
- [ ] variantes 320/768/1440 são geradas quando aplicável;
- [ ] alt e legenda são persistidos;
- [ ] SVG, MIME falso e arquivo acima do limite são rejeitados;
- [ ] quota é aplicada;
- [ ] mídia referenciada não é apagada fisicamente.

## 6. Publicação

- [ ] preview mostra rascunho privado;
- [ ] público continua mostrando release anterior até publicar;
- [ ] erros bloqueiam publicação;
- [ ] avisos exigem confirmação;
- [ ] release é imutável;
- [ ] troca de release é atômica;
- [ ] idempotência evita duplicação;
- [ ] histórico mostra 20 releases padrão;
- [ ] restauração cria rascunho e exige republicação.

## 7. Blog

- [ ] criar categoria e artigo;
- [ ] TipTap é sanitizado;
- [ ] capa, resumo e SEO funcionam;
- [ ] publicar artigo não publica alterações pendentes de páginas ou tema;
- [ ] agendamento captura versão explícita e publica no momento correto;
- [ ] edição posterior não altera silenciosamente o snapshot agendado;
- [ ] listagem e detalhe funcionam;
- [ ] latestPosts respeita configuração;
- [ ] RSS e sitemap incluem artigos publicados.

## 8. Aparência e navegação

- [ ] logo, favicon, cor, fonte, botões e radius funcionam;
- [ ] contraste inválido é bloqueado ou corrigido;
- [ ] cabeçalho e rodapé são globais;
- [ ] menu em dois níveis funciona no desktop e celular;
- [ ] links inválidos são rejeitados;
- [ ] domínio principal gera canonical correto.

## 9. Formulários

- [ ] configuração de campos funciona;
- [ ] submissão válida gera sucesso;
- [ ] payload fica criptografado no banco;
- [ ] painel descriptografa apenas para usuário autorizado;
- [ ] honeypot, tempo mínimo e rate limit funcionam;
- [ ] SMTP envia ou registra falha sem perder submissão;
- [ ] status nova/lida/arquivada/spam funciona.

## 10. Domínios

- [ ] custom domain é normalizado;
- [ ] instruções DNS são claras;
- [ ] TXT correto verifica;
- [ ] TXT incorreto não ativa;
- [ ] Caddy autoriza somente domínio ativo;
- [ ] TLS pode ser emitido em staging/produção;
- [ ] alias redireciona para principal;
- [ ] remoção desativa autorização.

## 11. Plataforma

- [ ] platform admin lista e pesquisa;
- [ ] usuário comum recebe 403;
- [ ] limites podem ser alterados;
- [ ] site pode ser suspenso e reativado;
- [ ] ações críticas geram auditoria;
- [ ] suspensão não apaga conteúdo;
- [ ] estados DRAFT, ACTIVE, SUSPENDED e ARCHIVED seguem `docs/SITE_STATES.md`.

## 12. Qualidade

- [ ] lint, typecheck, unit, integration, E2E e build passam;
- [ ] cobertura mínima atendida;
- [ ] axe sem violações críticas nos fluxos principais;
- [ ] Lighthouse atende metas do projeto no site seed;
- [ ] sem segredo real;
- [ ] sem vulnerabilidade crítica conhecida;
- [ ] logs não contêm dados sensíveis;
- [ ] backup e restauração foram testados;
- [ ] documentação reflete o comportamento real;
- [ ] nenhum item da V2 foi implementado por acidente.

## 13. Roteiro de aceitação por usuário leigo

Sem usar terminal ou documentação técnica, o avaliador deve conseguir:

1. criar conta;
2. criar site de serviços;
3. trocar nome, cor e logotipo;
4. alterar hero;
5. adicionar serviços, depoimentos e contato;
6. enviar fotos;
7. revisar celular;
8. publicar;
9. abrir o endereço público;
10. criar artigo;
11. receber contato;
12. cometer uma alteração ruim e restaurar versão anterior;
13. visualizar instruções para domínio próprio.

Qualquer ponto que exija conhecimento de código reprova a experiência da V1.
