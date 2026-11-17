import { AppProviders } from '@/components/providers/app-providers';

export default function CertificarLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}