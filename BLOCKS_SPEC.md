# BLOCKS_SPEC.md — Registry oficial de blocos V1

## 1. Regras gerais

- todos os blocos possuem `id`, `type`, `schemaVersion`, `visible`, `variant`, `settings` e `content`;
- `id` é UUID gerado no cliente e validado no servidor;
- `type` é discriminador imutável;
- `schemaVersion` inicia em 1;
- propriedades são validadas por Zod;
- nenhum bloco aceita HTML, CSS, JavaScript ou iframe arbitrário;
- links passam pelo validador comum;
- imagens referenciam `mediaId` no rascunho e são resolvidas no release;
- bloco invisível permanece no rascunho, mas não entra no release público;
- variantes são enumeradas e controladas;
- espaçamento usa tokens `none | sm | md | lg | xl`, sem pixels livres;
- alinhamento usa valores enumerados;
- cada bloco deve renderizar corretamente de 360 px a 1440 px;
- todo bloco deve ter estado vazio válido no editor e validação de publicação.

## 2. Estrutura base

```ts
interface BaseBlock {
  id: string;
  type: BlockType;
  schemaVersion: 1;
  visible: boolean;
  variant: string;
  settings: {
    width: 'narrow' | 'normal' | 'wide' | 'full';
    paddingTop: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    paddingBottom: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    background: 'default' | 'muted' | 'accent' | 'contrast';
  };
}
```

## 3. Blocos obrigatórios

### 3.1 `hero`

Uso: primeira seção ou destaque.

Conteúdo:

- eyebrow opcional;
- título obrigatório;
- descrição opcional;
- imagem opcional;
- botão primário opcional;
- botão secundário opcional.

Variantes:

- `centered`;
- `split-left`;
- `split-right`;
- `background-image`.

Regras:

- máximo de dois botões;
- apenas um `h1` deve existir por página; o renderer converte heroes posteriores para `h2`;
- contraste sobre imagem deve usar overlay controlado.

### 3.2 `richText`

Uso: texto editorial em página.

Conteúdo TipTap restrito:

- parágrafo;
- headings H2/H3;
- negrito, itálico;
- lista ordenada e não ordenada;
- link;
- citação;
- divisor.

Sem imagem inline; usar bloco de imagem ou galeria.

Variantes: `article`, `centered`, `lead`.

### 3.3 `imageText`

Conteúdo:

- imagem obrigatória para publicação;
- título;
- texto;
- botão opcional;
- posição de imagem.

Variantes: `image-left`, `image-right`, `card`.

### 3.4 `features`

Uso: serviços, benefícios ou diferenciais.

Conteúdo:

- título e descrição da seção;
- 2 a 8 itens;
- item com ícone do catálogo, título, descrição e link opcional.

Variantes: `grid`, `cards`, `list`.

Ícones vêm de conjunto Lucide permitido; não aceitar nome arbitrário sem validação.

### 3.5 `gallery`

Conteúdo:

- 2 a 20 imagens;
- legenda opcional;
- texto alternativo herdado da mídia ou sobrescrito.

Variantes: `grid`, `masonry-controlled`, `featured`.

Não implementar upload de vídeo.

### 3.6 `carousel`

Conteúdo:

- 2 a 10 slides;
- imagem;
- título opcional;
- descrição opcional;
- link opcional.

Configuração:

- autoplay boolean;
- intervalo entre 4 e 10 segundos;
- pausar em hover/foco;
- setas e indicadores sempre acessíveis.

Variantes: `images`, `cards`.

### 3.7 `testimonials`

Conteúdo:

- título da seção;
- 1 a 8 depoimentos;
- nome obrigatório;
- cargo/empresa opcional;
- texto obrigatório;
- foto opcional;
- avaliação opcional de 1 a 5.

Variantes: `cards`, `quote`, `carousel`.

### 3.8 `faq`

Conteúdo:

- título;
- 1 a 20 perguntas e respostas.

Variantes: `accordion`, `two-column`.

Acordeão deve usar elementos e atributos acessíveis.

### 3.9 `cta`

Conteúdo:

- título;
- descrição;
- botão primário;
- botão secundário opcional.

Variantes: `banner`, `boxed`, `split`.

### 3.10 `contact`

Conteúdo:

- título e descrição;
- campos habilitados;
- obrigatoriedade;
- rótulo do botão;
- mensagem de sucesso;
- consentimento opcional;
- destinatários são configurados nas configurações do site, não no snapshot público.

Campos disponíveis:

- nome;
- e-mail;
- telefone;
- assunto;
- mensagem;
- consentimento.

Regras mínimas:

- pelo menos um meio de contato: e-mail ou telefone;
- mensagem é obrigatória por padrão;
- honeypot invisível;
- timestamp de renderização assinado.

Variantes: `simple`, `split-info`.

### 3.11 `latestPosts`

Conteúdo/configuração:

- título;
- quantidade 3, 6 ou 9;
- categoria opcional;
- mostrar capa, resumo e data;
- botão “Ver todos”.

Variantes: `grid`, `list`, `featured`.

No release, os artigos são resolvidos pelo renderer a partir do próprio snapshot.

### 3.12 `video`

Conteúdo:

- URL de YouTube ou Vimeo;
- título acessível;
- legenda opcional;
- thumbnail opcional.

Variantes: `standard`, `cinema`.

A URL é convertida para embed seguro apenas para provedores permitidos. Carregamento deve ser lazy e com placeholder.

### 3.13 `linkCards`

Uso: links para produtos, redes, parceiros ou páginas externas.

Conteúdo:

- título da seção;
- 1 a 12 cards;
- título;
- descrição curta;
- imagem opcional;
- URL;
- indicação de link externo.

Variantes: `grid`, `compact`, `profile-links`.

### 3.14 `location`

Uso: endereço e acesso a mapa sem iframe arbitrário.

Conteúdo:

- título;
- endereço textual;
- complemento opcional;
- horários opcionais;
- URL validada de Google Maps, Apple Maps ou OpenStreetMap;
- telefone e WhatsApp opcionais.

Variantes: `card`, `split`.

A V1 não incorpora mapa interativo de terceiros; oferece card e botão “Abrir no mapa”.

### 3.15 `spacer`

Uso controlado para respiro visual.

Conteúdo: nenhum.

Tamanhos: `sm | md | lg`.

Não permitir altura livre.

## 4. Cabeçalho e rodapé

Não são blocos de página; fazem parte do site global.

### Cabeçalho

- logotipo ou nome textual;
- navegação;
- botão de destaque opcional;
- variantes `simple`, `centered`, `transparent-hero`;
- sticky opcional;
- menu mobile automático.

### Rodapé

- identidade;
- descrição curta;
- até 3 colunas de links;
- contatos;
- redes sociais;
- copyright automático/editável;
- variantes `simple`, `columns`, `compact`.

## 5. Catálogo de links

`LinkValue`:

```ts
{
  label: string;
  href: string;
  openInNewTab: boolean;
  rel: 'auto' | 'nofollow' | 'sponsored';
}
```

Protocolos permitidos:

- `https:`;
- `http:` apenas em desenvolvimento ou por opção explícita de link externo;
- `mailto:`;
- `tel:`;
- caminhos internos iniciando com `/`;
- WhatsApp convertido para URL HTTPS validada.

## 6. Validação de publicação

Erros bloqueiam publicação, avisos não.

Erros típicos:

- página sem título;
- página inicial inexistente;
- bloco com campo obrigatório vazio;
- mídia ausente ou não pronta;
- link inválido;
- IDs de bloco duplicados;
- slug reservado ou repetido;
- navegação apontando para recurso arquivado;
- formulário sem meio de contato;
- conteúdo acima dos limites.

Avisos típicos:

- imagem sem alt quando decorativa não marcada;
- SEO description ausente;
- hero sem CTA;
- página sem seção de contato;
- contraste próximo do limite;
- artigo sem capa.

## 7. Testes por bloco

Cada bloco deve possuir:

- teste de schema válido;
- teste de schema inválido;
- teste de default;
- teste de migração de versão;
- teste de renderização básica;
- teste de acessibilidade automatizado;
- fixture de exemplo usada no template ou catálogo interno.
