'use client';

import { useState, type SyntheticEvent } from 'react';

export function RecoveryForm() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333'}/v1/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email') }),
      });
      setMessage('Se a conta existir, enviaremos as instruções por e-mail.');
    } catch { setMessage('Não foi possível enviar agora. Tente novamente.'); }
    finally { setBusy(false); }
  }
  return <form className="auth-form" onSubmit={(event) => { void submit(event); }}>
    <label htmlFor="recovery-email">E-mail</label>
    <input id="recovery-email" name="email" type="email" autoComplete="email" required />
    <button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Enviar instruções'}</button>
    <p role="status" aria-live="polite">{message}</p>
    <a className="text-link" href="/entrar">Voltar para o login</a>
  </form>;
}
