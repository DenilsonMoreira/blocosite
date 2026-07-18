'use client';
import { useEffect, useState } from 'react';
const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';
export function VerifyForm({ token }: { token: string }) {
  const [message, setMessage] = useState(token ? 'Verificando seu e-mail…' : 'O link de verificação está incompleto.');
  useEffect(() => { if (!token) return; void fetch(`${api}/v1/auth/verify-email`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) }).then((response) => { setMessage(response.ok ? 'E-mail confirmado. Sua conta está pronta.' : 'Este link é inválido ou expirou.'); }).catch(() => { setMessage('Não foi possível verificar agora.'); }); }, [token]);
  return <><p role="status" aria-live="polite" className="description">{message}</p><a href="/entrar">Ir para o login</a></>;
}
