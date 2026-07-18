import { ResetForm } from './reset-form';
export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const { token = '' } = await searchParams; return <main><section className="card auth-card"><span className="brand">BlocoSite</span><p className="eyebrow">Segurança</p><h1>Crie uma nova senha.</h1><ResetForm token={token} /></section></main>; }
