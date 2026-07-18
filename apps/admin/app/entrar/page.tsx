import { LoginForm } from './login-form';

export default function LoginPage() {
  return <main><section className="card auth-card"><span className="brand">BlocoSite</span><p className="eyebrow">Acesse sua conta</p><h1>Bom ter você de volta.</h1><p className="description">Entre para editar e publicar seus sites.</p><LoginForm /></section></main>;
}
