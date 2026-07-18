# PRODUCT_SPEC.md — Especificação do BlocoSite V1

## 1. Produto

O BlocoSite é um CMS SaaS visual e controlado para criação de sites simples. Seu público inicial são pequenos negócios, profissionais autônomos e criadores brasileiros que precisam manter o próprio site sem depender de um desenvolvedor para cada alteração.

## 2. Posicionamento

> A forma mais simples de um pequeno negócio brasileiro criar, publicar e manter um site profissional.

O produto compete por simplicidade, previsibilidade e velocidade, não por quantidade de recursos.

## 3. Personas

### 3.1 Proprietário de pequeno negócio

- pouco conhecimento técnico;
- quer divulgar serviços, endereço, WhatsApp e depoimentos;
- precisa alterar textos e fotos sozinho;
- valoriza aparência profissional e funcionamento no celular.

### 3.2 Profissional autônomo

- precisa de landing page ou portfólio;
- quer formulário de contato e domínio próprio;
- publica ocasionalmente no blog.

### 3.3 Criador ou blogueiro

- precisa de página pessoal, links sociais e artigos;
- quer capa, categorias, RSS e compartilhamento.

### 3.4 Administrador da plataforma

- gerencia usuários, sites, limites e suspensões;
- não edita o conteúdo do cliente sem autorização explícita.

## 4. Jobs to be done

- “Quero colocar meu negócio na internet sem aprender programação.”
- “Quero trocar uma foto ou preço sem chamar o desenvolvedor.”
- “Quero publicar um artigo e compartilhar o link.”
- “Quero receber contatos pelo meu site.”
- “Quero usar meu próprio domínio.”
- “Quero desfazer uma alteração que ficou ruim.”

## 5. Escopo funcional da V1

### 5.1 Conta

- cadastro com nome, e-mail e senha;
- aceite dos termos;
- verificação de e-mail;
- login e logout;
- recuperação e redefinição de senha;
- alteração de nome, e-mail e senha;
- encerramento lógico da conta, desde que não existam pendências administrativas.

### 5.2 Sites

- um usuário pode possuir mais de um site, respeitando limite configurado;
- criação por assistente;
- nome interno, nome público, segmento, idioma fixo `pt-BR` e fuso horário;
- status `DRAFT`, `ACTIVE`, `SUSPENDED` ou `ARCHIVED`, com comportamento definido em `docs/SITE_STATES.md`;
- transferência de propriedade não pertence à V1;
- inclusão de editores por convite de e-mail;
- papéis `OWNER` e `EDITOR`.

### 5.3 Templates oficiais

1. **Serviços Profissionais** — advogado, consultor, técnico, clínica ou escritório;
2. **Restaurante e Café** — apresentação, cardápio por seções, galeria e localização por link;
3. **Portfólio Pessoal** — profissional criativo, desenvolvedor ou artista;
4. **Blog e Criador** — perfil, links, artigos recentes e newsletter apenas como CTA externo.

Templates são seeds de conteúdo. Após aplicados, tornam-se blocos normais. Não existe vínculo dinâmico com o template original.

### 5.4 Páginas

- criar, renomear, duplicar, arquivar e restaurar;
- definir página inicial;
- slug editável com validação;
- status de rascunho;
- SEO por página;
- ordem no painel;
- páginas arquivadas não entram na publicação;
- exclusão definitiva apenas se nunca publicada e sem referência.

### 5.5 Editor visual

- lista de blocos permitidos;
- canvas central com preview real;
- inspetor lateral de propriedades;
- adicionar, selecionar, editar, duplicar, ocultar, remover e reordenar;
- drag and drop e alternativa por botões;
- desfazer/refazer em memória durante a sessão;
- autosave do rascunho;
- indicador de salvamento;
- visualização desktop, tablet e celular;
- aviso ao sair com alteração local não sincronizada;
- validação antes de preview e publicação.

### 5.6 Aparência global

- logotipo e favicon;
- paleta principal e neutra;
- escolha entre combinações de fontes aprovadas;
- estilo de botão;
- raio de borda;
- largura de conteúdo;
- cabeçalho e rodapé globais;
- alternância de visibilidade de redes sociais;
- contraste mínimo validado.

Não há CSS personalizado.

### 5.7 Mídia

- upload de JPEG, PNG e WebP;
- limite padrão de 10 MB por original;
- compressão e variantes responsivas;
- título interno, texto alternativo e legenda;
- busca por nome;
- reutilização em várias páginas;
- exclusão lógica quando houver referência;
- cota por site configurável.

SVG, GIF animado, vídeo próprio e documentos ficam fora da V1.

### 5.8 Blog

- título, slug, resumo, capa, autor, categoria e conteúdo TipTap;
- rascunho, publicado, agendado e arquivado;
- publicação individual de artigo cria release sem incluir outros rascunhos;
- agendamento captura snapshot imutável do artigo e é processado pela API em job interno periódico;
- página de listagem e página individual;
- categorias simples;
- SEO e imagem social;
- RSS;
- artigos recentes por bloco.

Tags, comentários e múltiplos autores visíveis ficam fora da V1.

### 5.9 Navegação

- menu global com páginas, artigos específicos ou links externos;
- até dois níveis: item e subitem;
- botão de destaque opcional;
- validação de link;
- menu responsivo automático;
- rodapé com colunas controladas.

### 5.10 Preview, publicação e histórico

- preview privado representa todo o estado atual de rascunho;
- token de preview curto e revogável;
- publicação completa cria um release imutável do site inteiro;
- publicação, retirada ou agendamento de artigo também cria release derivado do release ativo, sem levar outros rascunhos ao ar;
- troca do release ativo deve ser atômica;
- manter os 20 releases mais recentes por padrão;
- restaurar um release cria novo rascunho, sem modificar o release antigo;
- publicação idempotente por chave de operação;
- mostrar data, autor e descrição opcional do release.

### 5.11 Formulário de contato

- bloco configurável com campos predefinidos: nome, e-mail, telefone, assunto, mensagem e consentimento;
- campos podem ser obrigatórios ou ocultos, respeitando regras mínimas;
- salva submissão no painel;
- envia notificação por SMTP quando configurado;
- honeypot, tempo mínimo, rate limit e Turnstile opcional;
- permitir marcar como lida e arquivar;
- exportação CSV não pertence à V1.

### 5.12 SEO e distribuição

- meta title e description;
- canonical;
- Open Graph;
- favicon;
- `robots.txt`;
- sitemap de páginas e artigos publicados;
- RSS do blog;
- opção de impedir indexação enquanto o site está em preparação;
- redirecionamento para domínio principal;
- páginas 404 e 500 com identidade do site.

### 5.13 Domínios

- subdomínio gratuito único no domínio base da plataforma;
- domínio personalizado por CNAME ou apontamento documentado;
- verificação de propriedade por TXT;
- status e instruções no painel;
- TLS automático por Caddy após aprovação da API interna;
- um domínio principal e aliases;
- redirecionamento HTTPS e para o domínio principal.

### 5.14 Administração da plataforma

- autenticação separada por papel `PLATFORM_ADMIN`;
- listar usuários e sites;
- pesquisar por e-mail, nome, site ou domínio;
- suspender e reativar site;
- definir limites de sites, páginas, mídia e releases;
- ver auditoria;
- não permitir leitura de senhas ou tokens;
- impersonação fica fora da V1.

## 6. Requisitos não funcionais

- UI principal em português do Brasil;
- responsividade de 360 px a telas grandes;
- acessibilidade WCAG 2.2 AA nos fluxos essenciais;
- isolamento multi-tenant;
- páginas públicas com bom desempenho e cache;
- dados em UTC;
- logs estruturados com request ID;
- backup restaurável;
- implantação por Docker Compose em servidor Linux;
- nenhum serviço pago obrigatório para desenvolvimento.

## 7. Métricas de sucesso da V1

- usuário leigo publica o primeiro site sem editar código;
- fluxo de criação até publicação pode ser concluído em uma única sessão;
- página pública passa nos critérios de acessibilidade e desempenho definidos;
- nenhum usuário acessa dados de outro site;
- restauração de release recupera conteúdo e aparência;
- formulário público resiste aos controles básicos de spam;
- domínio próprio é verificável e recebe TLS.

## 8. Limites padrão

Configuração inicial, alterável por administrador:

- 3 sites por proprietário;
- 25 páginas por site;
- 200 artigos por site;
- 1 GB de mídia por site;
- 20 releases mantidos;
- 5 membros por site;
- 5 domínios por site;
- 200 submissões de formulário por mês antes de alerta administrativo.

Não implementar cobrança ou bloqueio financeiro automático.

## 9. Fora de escopo

Tudo em `docs/V2_NOTES.md` permanece fora da V1, mesmo que pareça simples durante a implementação.
