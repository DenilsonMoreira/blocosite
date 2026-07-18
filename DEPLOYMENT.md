# DEPLOYMENT.md — Implantação da V1

## 1. Alvo

Servidor Linux x86_64 ou ARM64 compatível com Docker, com:

- 4 vCPU recomendados;
- 8 GB RAM recomendados para aplicação, banco e processamento de imagem inicial;
- armazenamento persistente e backup;
- portas 80 e 443 públicas;
- DNS do domínio base sob controle do operador.

Pode começar em um único servidor. Escala horizontal avançada fica para V2.

## 2. Serviços

- `caddy`;
- `admin`;
- `api`;
- `sites`;
- `postgres`;
- `minio` opcional em produção própria;
- job/scheduler incluído no processo API com advisory lock.

Mailpit apenas em desenvolvimento.

## 3. Domínios da plataforma

Exemplo:

- `app.exemplo.com` painel;
- `api.exemplo.com` API;
- `media.exemplo.com` mídia;
- `*.sites.exemplo.com` subdomínios de clientes;
- domínios customizados apontam para o Caddy.

O domínio base deve ser configurável por ambiente.

## 4. Variáveis essenciais

- `NODE_ENV`;
- `DATABASE_URL`;
- `APP_BASE_URL`;
- `API_BASE_URL`;
- `SITES_BASE_DOMAIN`;
- `COOKIE_DOMAIN`;
- `SESSION_PEPPER`;
- `TOKEN_PEPPER`;
- `APP_DATA_ENCRYPTION_KEY`;
- `INTERNAL_SERVICE_SECRET`;
- `S3_ENDPOINT`;
- `S3_REGION`;
- `S3_BUCKET`;
- `S3_ACCESS_KEY_ID`;
- `S3_SECRET_ACCESS_KEY`;
- `S3_PUBLIC_BASE_URL`;
- `SMTP_*`;
- `TURNSTILE_*` opcionais;
- `CADDY_ASK_SECRET`;
- limites operacionais.

Validar no startup. Ver `.env.example`.

## 5. Processo de deploy

1. obter código e lockfile;
2. construir imagens imutáveis;
3. executar testes e scan;
4. fazer backup do banco;
5. executar migration em job único;
6. subir API e verificar readiness;
7. subir admin/sites;
8. recarregar Caddy;
9. executar smoke tests;
10. manter versão anterior disponível para rollback.

Não executar migrations automaticamente em cada réplica da API.

## 6. Rollback

Aplicação:

- retornar às imagens anteriores;
- migrations devem ser preferencialmente compatíveis para rollback de aplicação;
- migration destrutiva exige estratégia expand-contract, mesmo em servidor único.

Conteúdo:

- usar release anterior pelo painel;
- não restaurar banco para corrigir erro editorial.

Banco:

- restauração de backup somente para desastre;
- testar procedimento antes do lançamento.

## 7. Backups

- PostgreSQL diário, com retenção mínima de 7 diários e 4 semanais;
- mídia com versionamento ou snapshot quando disponível;
- backup criptografado fora do servidor principal;
- teste de restauração mensal;
- registrar duração e resultado.

## 8. Caddy

Funções:

- TLS do painel/API/base;
- wildcard do subdomínio da plataforma, preferindo certificado wildcard configurado;
- reverse proxy;
- compressão;
- redirects;
- On-Demand TLS para domínios customizados;
- endpoint `ask` da API interna.

Nunca habilitar On-Demand TLS sem endpoint de autorização.

## 9. Armazenamento

Desenvolvimento usa MinIO.
Produção pode usar MinIO ou provedor S3 compatível sem alterar código.

Requisitos:

- bucket privado para originais;
- variantes públicas por domínio de mídia ou proxy/CDN;
- CORS mínimo;
- lifecycle para temporários;
- versionamento recomendado;
- chaves de acesso exclusivas da aplicação.

## 10. E-mail

SMTP é opcional para desenvolvimento e obrigatório para fluxos completos de produção.

- remetente verificado;
- SPF, DKIM e DMARC recomendados;
- fila externa não existe na V1; tentativas ficam registradas e job interno faz retry limitado;
- falha de e-mail não desfaz submissão de formulário nem publicação.

## 11. Monitoramento mínimo

- uptime de painel, API e sites;
- readiness;
- uso de disco;
- conexões e tamanho do PostgreSQL;
- erros 5xx;
- falhas de upload;
- falhas de publicação;
- falhas de e-mail;
- falhas de certificado;
- backups.

Integração com plataforma específica fica a cargo da implantação; logs JSON são a interface comum.

## 12. Ambientes

- `development`: Docker local, Mailpit, MinIO;
- `test`: serviços isolados e dados descartáveis;
- `staging`: configuração semelhante à produção e domínios de teste;
- `production`: segredos próprios, backups, TLS e no debug.

Nunca reutilizar banco ou bucket entre ambientes.

## 13. Smoke tests pós-deploy

- `/health/live` e `/health/ready`;
- login;
- leitura de um site;
- preview;
- publicação de site de teste;
- página pública por subdomínio;
- upload de imagem pequena;
- formulário de teste;
- autorização Caddy para domínio conhecido e rejeição de desconhecido.
