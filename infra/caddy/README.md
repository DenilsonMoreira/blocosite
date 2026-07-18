# Caddy — alvo da Fase 10

A configuração final deve cobrir:

- `app.<base-domain>` → `admin`;
- `api.<base-domain>` → `api`;
- `*.<sites-base-domain>` → `sites`;
- domínios customizados → `sites`;
- TLS automático;
- On-Demand TLS com endpoint `ask` protegido;
- headers de proxy e request ID;
- compressão;
- redirects para HTTPS e domínio principal.

Não habilitar On-Demand TLS antes do endpoint de autorização estar testado.
