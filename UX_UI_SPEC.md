# UX_UI_SPEC.md — Experiência e design da V1

## 1. Objetivo visual

O painel deve transmitir simplicidade, segurança e profissionalismo. Não deve parecer uma ferramenta técnica nem um painel administrativo genérico.

Princípios:

- linguagem simples;
- uma ação principal clara por tela;
- configurações avançadas escondidas até serem necessárias;
- feedback imediato;
- layouts arejados;
- prevenção de erro em vez de mensagens tardias;
- consistência em desktop e celular.

## 2. Identidade inicial do produto

Nome de trabalho: **BlocoSite**.

Personalidade:

- amigável;
- prática;
- confiável;
- brasileira sem caricatura;
- moderna sem excesso de efeitos.

A marca definitiva pode mudar antes do lançamento, mas a UI não deve depender do nome em componentes internos.

## 3. Design system do painel

### 3.1 Tokens

- escala de espaçamento de 4 px;
- radius: 8, 12 e 16 px;
- sombras discretas;
- foco visível com espessura mínima de 2 px;
- largura máxima de leitura de 72 caracteres;
- alvos interativos mínimos de 44 × 44 px em telas de toque.

### 3.2 Cores

Painel com neutros claros e cor de ação configurada pela marca do BlocoSite. Estados sem depender apenas de cor.

Obrigatórios:

- `surface`;
- `surface-muted`;
- `text`;
- `text-muted`;
- `border`;
- `primary`;
- `primary-contrast`;
- `success`;
- `warning`;
- `danger`;
- `focus`.

### 3.3 Tipografia

Painel usa uma família sans legível. Conteúdo público usa combinações aprovadas:

1. Manrope + Inter;
2. Merriweather + Inter;
3. Lora + Source Sans 3;
4. Playfair Display + Manrope.

Carregar por `next/font`, com fallback local adequado.

## 4. Arquitetura de navegação do painel

Menu principal:

- Visão geral;
- Páginas;
- Blog;
- Mídia;
- Mensagens;
- Aparência;
- Navegação;
- Domínios;
- Configurações.

No topo:

- seletor de site;
- botão “Ver site”;
- status de publicação;
- menu da conta.

Administração da plataforma usa layout e rota separados.

## 5. Onboarding

### 5.1 Primeira conta

Após verificar e-mail:

1. boas-vindas;
2. nome do negócio/site;
3. segmento;
4. escolha de template;
5. escolha de subdomínio;
6. identidade básica: logo opcional e cor principal;
7. criação transacional;
8. entrada no checklist inicial.

### 5.2 Checklist

- revisar página inicial;
- adicionar forma de contato;
- enviar logotipo ou foto;
- revisar versão mobile;
- publicar;
- conectar domínio, opcional.

Checklist desaparece quando concluído, mas pode ser reaberto.

## 6. Dashboard

Cards essenciais:

- status do site;
- última publicação;
- mensagens novas;
- uso de mídia;
- atalhos para editar página inicial, novo artigo e domínio.

Não incluir gráficos avançados na V1.

## 7. Editor visual

### 7.1 Desktop

```text
┌──────────────────────────────────────────────────────────┐
│ Voltar | Página: Início | Salvando... | Preview | Publicar│
├──────────────┬────────────────────────────┬───────────────┤
│ Estrutura    │ Canvas responsivo          │ Propriedades  │
│ de blocos    │                            │ do bloco      │
└──────────────┴────────────────────────────┴───────────────┘
```

- painel esquerdo recolhível;
- canvas em iframe ou boundary isolado com CSS do site;
- painel direito com campos agrupados;
- barra de dispositivos;
- breadcrumb do item selecionado;
- ações do bloco aparecem também no canvas.

### 7.2 Celular

- canvas em tela cheia;
- estrutura e propriedades em bottom sheets;
- ações principais fixas;
- reordenação por botões, sem depender de drag;
- publicação exige resumo de validação.

### 7.3 Autosave

Estados visíveis:

- `Alterações locais`;
- `Salvando…`;
- `Salvo às 14:32`;
- `Falha ao salvar — tentar novamente`;
- `Conflito detectado — recarregar ou copiar alterações`.

Debounce inicial: 800 ms após última edição. Não enviar enquanto operação anterior estiver em andamento; consolidar alteração seguinte.

### 7.4 Undo/redo

- histórico local de até 50 operações;
- atalhos `Ctrl/Cmd+Z` e `Ctrl/Cmd+Shift+Z`;
- histórico zera ao trocar de página ou recarregar;
- não substitui releases.

## 8. Biblioteca de blocos

Blocos agrupados:

- Destaque: Hero, CTA;
- Conteúdo: Texto, Imagem + texto, Vídeo;
- Negócio: Serviços, Depoimentos, FAQ, Localização, Contato;
- Mídia: Galeria, Carrossel;
- Navegação: Cards de links;
- Blog: Artigos recentes;
- Layout: Espaçador.

Cada bloco mostra miniatura, nome e descrição curta.

## 9. Formulários de propriedades

- rótulo acima do campo;
- ajuda curta quando necessário;
- limites de caracteres visíveis perto do limite;
- preview do link normalizado;
- seletor de mídia abre biblioteca;
- campos condicionais aparecem progressivamente;
- erros junto ao campo e resumo no topo quando publicação falhar.

## 10. Aparência

Tela dividida em:

- Marca: logo, favicon, nome;
- Cores: paletas sugeridas e cor principal;
- Tipografia: quatro pares;
- Estilo: botões, radius e largura;
- Cabeçalho;
- Rodapé.

A cor customizada deve gerar escala e ser validada. Se contraste falhar, sugerir correção automática.

## 11. Páginas e blog

Listas devem ter:

- busca;
- status;
- última edição;
- ações rápidas;
- empty state com CTA;
- paginação quando necessário.

Artigo usa editor focado, sem as três colunas do page builder.

## 12. Publicação

Ao clicar em “Publicar”:

1. validar;
2. mostrar erros e avisos;
3. permitir corrigir erro clicando no item;
4. solicitar descrição opcional;
5. publicar;
6. mostrar URL e ações “Abrir site” e “Copiar link”.

Avisos não bloqueiam, mas exigem confirmação explícita.

## 13. Histórico

Lista cronológica com:

- número do release;
- autor;
- data;
- descrição;
- indicação do ativo;
- ação visualizar;
- ação restaurar.

Restaurar mostra claramente: “Isso copiará esta versão para o rascunho. O site publicado não muda até uma nova publicação.”

## 14. Domínios

Wizard:

1. informar domínio;
2. mostrar registros DNS exatos;
3. botão verificar;
4. status por etapa;
5. ativação e TLS;
6. definir principal.

Usar linguagem sem jargão e uma seção “Enviar estas instruções para quem gerencia meu domínio”.

## 15. Estados obrigatórios

Toda tela assíncrona precisa de:

- skeleton ou loading proporcional;
- estado vazio;
- erro recuperável;
- erro sem permissão;
- sucesso;
- comportamento offline básico, preservando alterações locais do editor até reconexão na sessão.

Não implementar PWA/offline completo.

## 16. Acessibilidade

- navegação por teclado;
- foco gerenciado em dialogs e sheets;
- skip link no site público;
- landmarks semânticos;
- labels e descrições;
- contraste AA;
- carrossel pausável;
- `prefers-reduced-motion`;
- não usar placeholder como único rótulo;
- mensagens de autosave em live region moderada;
- testes com axe nas telas essenciais.

## 17. Microcopy

Preferir:

- “Publicar site” em vez de “Deploy”;
- “Endereço do site” em vez de “URL canônica” no fluxo comum;
- “Versões anteriores” em vez de “Snapshots”;
- “Não foi possível salvar” com ação clara;
- “Mover para cima” em vez de ícone sem texto acessível.

Termos técnicos podem aparecer em ajuda contextual de domínio e SEO.
