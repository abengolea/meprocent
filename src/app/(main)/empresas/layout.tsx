import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Empresas | MEPROCENT',
  description: 'Gestión de empresas y clientes.',
};

export default function EmpresasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
