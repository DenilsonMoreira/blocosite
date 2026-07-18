'use client';

import { useState, type SyntheticEvent } from 'react';

const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

export function RegisterForm() {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('Criando sua conta…');
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${api}/v1/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), password: data.get('password'), acceptedTerms: data.get('terms') === 'on' }) });
      setMessage(response.ok ? 'Conta criada. Confira seu e-mail para continuar.' : 'Revise os dados e tente novamente.');
    } catch { setMessage('Não foi possível criar a conta agora.'); }
    finally { setBusy(false); }
  }
  return <form className="auth-form" onSubmit={(event) => { void submit(event); }}>
    <label htmlFor="name">Nome</label><input id="name" name="name" autoComplete="name" minLength={2} required />
    <label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required />
    <label htmlFor="password">Senha</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required aria-describedby="password-help" />
    <small id="password-help">Use pelo menos 10 caracteres.</small>
    <label className="check"><input name="terms" type="checkbox" required /> Aceito os termos de uso e a política de privacidade.</label>
    <button type="submit" disabled={busy}>{busy ? 'Criando…' : 'Criar conta'}</button>
    <p role="status" aria-live="polite">{message}</p><a className="text-link" href="/entrar">Já tenho uma conta</a>
  </form>;
}
