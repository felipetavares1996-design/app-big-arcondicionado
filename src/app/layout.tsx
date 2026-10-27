import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Toast from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Big Arcondicionado | Gestão Integrada de PMOC & Manutenção',
  description: 'Plataforma integrada de gestão PMOC para contratos públicos e licitações - Prefeitura Municipal de Bertioga',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <AppProvider>
          {children}
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
