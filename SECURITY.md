# SECURITY.md — Requisitos obrigatórios

## 1. Objetivo

Proteger contas, conteúdo, domínios, arquivos e dados recebidos por formulários, com foco especial em isolamento multi-tenant e prevenção de execução de conteúdo malicioso.

## 2. Ameaças prioritárias

- acesso de um cliente aos dados de outro;
- tomada de conta;
- CSRF;
- XSS armazenado em blocos ou artigos;
- upload malicioso;
- abuso do formulário público;
- emissão indevida de certificado TLS;
- vazamento de tokens em logs;
- enumeração de contas;
- SSRF por URLs externas;
- mass assignment;
- perda de conteúdo durante publicação;
- exposição de dados pessoais de submissões.

## 3. Autenticação

- senha mínima de 10 caracteres e máxima de 128;
- aceitar passphrases e não impor composição artificial;
- Argon2id com parâmetros ajustados ao ambiente e teste de custo;
- comparação constante;
- resposta neutra em recuperação de senha;
- tokens aleatórios de pelo menos 256 bits;
- armazenar apenas hash SHA-256 dos tokens;
- uso único e expiração curta;
- revogar sessões após troca ou reset de senha;
- rate limit progressivo em login, registro, verificação e reset;
- não revelar se e-mail existe.

## 4. Sessões e cookies

- cookie `HttpOnly`;
- `Secure` em produção;
- `SameSite=Lax`;
- path adequado;
- domínio configurado conscientemente para painel/API;
- rotação após autenticação;
- lista de sessões e revogação;
- token bruto nunca no banco ou log.

## 5. CSRF e origem

- token CSRF por sessão em toda mutação autenticada;
- validar `Origin` contra allowlist;
- rejeitar ausência de origem em requisições de navegador mutáveis, salvo clientes internos autenticados;
- CORS estrito com credenciais apenas para o painel oficial;
- não usar `*` com credenciais.

## 6. Autorização e tenancy

- autorização no service, não apenas na UI;
- query sempre limitada por site autorizado;
- IDs previsíveis não concedem acesso;
- endpoint de plataforma exige papel global;
- editor não gerencia domínios, membros, limites ou exclusão do site;
- logs de auditoria para publicação, restauração, domínio, membro, senha, e-mail, suspensão e limites;
- testes negativos entre tenants obrigatórios.

## 7. Conteúdo e XSS

- blocos são dados estruturados, nunca HTML livre;
- TipTap é sanitizado no servidor por allowlist;
- links validados por URL parser;
- bloquear `javascript:`, `data:`, `vbscript:`, `file:` e URLs com credenciais;
- atributos `rel="noopener noreferrer"` em nova aba;
- CSP no site público e painel;
- evitar `dangerouslySetInnerHTML`; quando inevitável para TipTap sanitizado, encapsular e testar;
- escapar conteúdo textual por padrão.

CSP inicial:

- `default-src 'self'`;
- imagens do domínio de mídia e `data:` apenas para placeholders internos controlados;
- scripts próprios e embeds permitidos de YouTube/Vimeo com regras específicas;
- `frame-ancestors 'none'` no painel;
- site público pode permitir frame apenas se requisito explícito futuro; V1 usa `self`/`none`.

## 8. Upload

- formatos permitidos: JPEG, PNG e WebP;
- validar magic bytes, não confiar em extensão ou MIME do cliente;
- máximo 10 MB;
- limites de dimensão e megapixels para prevenir decompression bomb;
- processar em memória limitada ou arquivo temporário seguro;
- remover EXIF;
- gerar novo arquivo por Sharp;
- chave aleatória, sem caminho do usuário;
- bucket sem listagem pública;
- URLs públicas somente para variantes aprovadas;
- SVG proibido;
- varrer arquivos temporários;
- checksum para integridade e possível deduplicação futura sem misturar tenants.

## 9. Formulários públicos

- validar configuração contra release ativo;
- rejeitar campos desconhecidos;
- honeypot;
- tempo mínimo assinado;
- limite por IP hash, site e bloco;
- limite de tamanho por campo;
- Turnstile opcional quando configurado;
- normalizar e-mail e telefone;
- não refletir entrada bruta na resposta;
- criptografar payload em repouso;
- não registrar corpo da submissão;
- retenção configurável;
- link em e-mail de notificação aponta para painel, evitando repetir todos os dados sensíveis quando possível.

## 10. Criptografia de submissões

- chave mestra fornecida por secret `APP_DATA_ENCRYPTION_KEY`;
- usar algoritmo autenticado moderno disponível na plataforma, como AES-256-GCM;
- nonce único por registro;
- armazenar versão do envelope criptográfico;
- permitir rotação futura por versão de chave;
- falhar no startup de produção se a chave estiver ausente.

## 11. Domínios e TLS

- normalizar hostname com biblioteca adequada e IDNA;
- bloquear IPs, localhost, TLD inválido e domínios reservados;
- verificar TXT de posse;
- endpoint de autorização do Caddy protegido por rede e secret;
- autorizar somente domínio `ACTIVE`;
- rate limit de verificações;
- não fazer fetch HTTP arbitrário ao domínio durante verificação;
- evitar SSRF usando apenas resolvedor DNS e regras estritas;
- registrar mudanças de domínio.

## 12. Banco e segredos

- usuário do banco com menor privilégio necessário;
- conexão TLS em produção quando disponível;
- backup criptografado;
- segredos via variáveis/secret manager, nunca git;
- `.env` ignorado;
- não expor Prisma Studio em produção;
- migrations executadas por etapa controlada de deploy;
- queries parametrizadas pelo Prisma;
- raw SQL somente em migrations ou casos documentados e parametrizados.

## 13. Headers

Painel e API:

- HSTS em produção;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy` restritiva;
- `Permissions-Policy` mínima;
- CSP;
- proteção contra framing;
- cache `no-store` para respostas autenticadas sensíveis.

## 14. Logs e privacidade

Nunca registrar:

- senha;
- cookie;
- token bruto;
- corpo completo de formulário;
- chave de criptografia;
- URL de preview com token;
- credenciais SMTP/S3.

Usar hash com salt/pepper para IP quando necessário a abuso, sem guardar IP puro por padrão.

## 15. Dependências

- lockfile obrigatório;
- CI executa auditoria de dependências;
- não aceitar pacote sem manutenção para função crítica quando houver alternativa da stack definida;
- atualizações de segurança dentro da mesma major são correções permitidas pelo congelamento;
- atualizar Node/Next/React/Fastify apenas dentro das linhas definidas, salvo vulnerabilidade que exija migração e seja documentada.

## 16. Checklist antes do release

- teste de isolamento multi-tenant;
- teste de CSRF;
- teste de sessão revogada;
- sanitização de conteúdo;
- upload com MIME falso, arquivo grande e decompression bomb;
- abuso de formulário;
- domínio não autorizado no endpoint Caddy;
- headers e CSP;
- secrets scan;
- dependências sem vulnerabilidade crítica conhecida;
- restore de backup testado;
- logs sem dados sensíveis.
