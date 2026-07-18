import type { Metadata } from 'next';
import './styles.css';
export const metadata: Metadata = { title: 'BlocoSite', description: 'Sites profissionais, do seu jeito.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
