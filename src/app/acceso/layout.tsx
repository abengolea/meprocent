import { AppProviders } from '@/components/providers/app-providers';

export default function AccesoLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}