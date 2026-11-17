'use client';

import { FirebaseClientProvider } from '@/firebase/client-provider';

/** Firebase + listeners usados por el portal y rutas autenticadas. No cargar en la landing pública. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FirebaseClientProvider>{children}</FirebaseClientProvider>;
}