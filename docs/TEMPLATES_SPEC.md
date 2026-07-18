# TEMPLATES_SPEC.md — Templates oficiais V1

## 1. Regras

- templates são seeds versionados, não temas dinâmicos;
- cada template usa somente blocos de `BLOCKS_SPEC.md`;
- textos são exemplos claros em pt-BR e devem ser fáceis de substituir;
- não usar fotos externas ou material com licença incerta;
- imagens iniciais podem ser placeholders abstratos locais, claramente marcados para substituição;
- IDs são gerados na criação do site;
- aplicar template é transacional e idempotente no seed;
- todos incluem navegação, rodapé, SEO inicial e pelo menos uma forma de contato.

## 2. Serviços Profissionais

### Visual

- fonte: Manrope + Inter;
- paleta: azul profundo, azul claro e neutros;
- estilo: confiável, limpo, com cards discretos.

### Páginas

#### Início

1. hero `split-left`;
2. features com 3 serviços;
3. imageText “Sobre o trabalho”;
4. testimonials com 3 exemplos;
5. faq com 4 perguntas;
6. cta para WhatsApp;
7. contact.

#### Sobre

1. hero centered;
2. richText;
3. imageText;
4. features com valores;
5. cta.

#### Serviços

1. hero centered;
2. features 6 itens;
3. imageText processo de atendimento;
4. faq;
5. contact.

#### Blog

Página de listagem nativa com latestPosts na home.

#### Contato

1. hero curto;
2. location;
3. contact.

### Menu

Início, Sobre, Serviços, Blog, Contato; botão “Falar no WhatsApp”.

## 3. Restaurante e Café

### Visual

- fonte: Playfair Display + Manrope;
- paleta: terracota, creme e carvão;
- estilo: acolhedor e fotográfico.

### Páginas

#### Início

1. hero background-image;
2. imageText história curta;
3. features para categorias do cardápio;
4. gallery;
5. testimonials;
6. location;
7. cta reserva/WhatsApp.

#### Cardápio

1. hero curto;
2. richText de observações;
3. features por categoria e itens resumidos;
4. cta para cardápio externo opcional.

#### Galeria

1. hero curto;
2. gallery até 12 placeholders;
3. carousel;
4. cta.

#### Contato

1. location com horários;
2. contact;
3. linkCards para delivery e redes.

### Menu

Início, Cardápio, Galeria, Contato; botão “Pedir pelo WhatsApp”.

## 4. Portfólio Pessoal

### Visual

- fonte: Lora + Source Sans 3;
- paleta: roxo escuro, lilás e neutros;
- estilo: expressivo, com grande tipografia.

### Páginas

#### Início

1. hero split-right;
2. richText lead;
3. gallery featured com projetos;
4. features com competências;
5. testimonials;
6. cta contato.

#### Sobre

1. imageText;
2. richText trajetória;
3. features ferramentas/competências;
4. linkCards redes.

#### Projetos

1. hero curto;
2. gallery;
3. imageText de estudo de caso;
4. cta.

#### Contato

1. hero curto;
2. contact;
3. linkCards.

### Menu

Início, Sobre, Projetos, Contato.

## 5. Blog e Criador

### Visual

- fonte: Merriweather + Inter;
- paleta: verde escuro, verde claro e branco;
- estilo: editorial e legível.

### Páginas

#### Início

1. hero centered;
2. latestPosts featured;
3. richText de apresentação;
4. linkCards para redes e projetos;
5. cta para canal/lista externa;
6. contact simples.

#### Sobre

1. imageText;
2. richText;
3. linkCards.

#### Links

1. hero curto;
2. linkCards profile-links;
3. video opcional com URL vazia não publicável até configurada ou bloco inicialmente oculto.

#### Blog

Listagem nativa.

### Menu

Início, Sobre, Blog, Links; botão “Acompanhar”.

## 6. Conteúdo seed

O seed de demonstração deve criar um site “Café Horizonte” ou outro nome fictício claramente não real, com:

- textos completos e profissionais;
- imagens abstratas locais;
- pelo menos 2 artigos;
- todas as páginas válidas;
- formulário configurado para Mailpit;
- um release publicado;
- usuário demo documentado apenas em desenvolvimento.

Credencial demo deve vir de variável de ambiente ou valor local claramente não utilizável em produção.

## 7. Testes

Para cada template:

- criação transacional;
- documentos válidos;
- slugs únicos;
- página inicial única;
- navegação sem links quebrados;
- publicação bem-sucedida;
- renderização mobile;
- ausência de dependência externa de mídia.
