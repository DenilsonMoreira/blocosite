'use client';

import { useState, type SyntheticEvent } from 'react';

export function LoginForm() {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setStatus('Entrando…');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333'}/v1/auth/login`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      });
      if (!response.ok) { setStatus('E-mail ou senha inválidos.'); return; }
      setStatus('Login realizado com sucesso.');
    } catch { setStatus('Não foi possível conectar. Tente novamente.'); }
    finally { setBusy(false); }
  }

  return <form onSubmit={(event) => { void submit(event); }} className="auth-form">
    <label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required />
    <label htmlFor="password">Senha</label><input id="password" name="password" type="password" autoComplete="current-password" minLength={10} required />
    <button type="submit" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
    <p role="status" aria-live="polite">{status}</p>
    <a className="text-link" href="/recuperar-senha">Esqueci minha senha</a>
  </form>;
}
