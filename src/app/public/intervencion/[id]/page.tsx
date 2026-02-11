
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PestControlDossier } from '@/components/interventions/pest-control-dossier';
import { MeprocentLogo, MeprocentText } from '@/components/logo';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import type { Intervencion } from '@/lib/types';

export default function PublicIntervencionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const token = searchParams.get('token');

  const { data: intervencion, loading, error } = useDoc<Intervencion>(
    db && id ? doc(db, 'intervenciones', id) : null
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 flex flex-col items-center gap-8">
        <MeprocentLogo className="h-16 w-16" />
        <Skeleton className="h-[500px] w-full max-w-4xl" />
      </div>
    );
  }

  const isValidToken = intervencion && intervencion.token === token;

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-secondary text-white p-4 mb-8 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <MeprocentLogo className="h-10 w-10" />
          <MeprocentText subtext={false} />
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-xs opacity-70 uppercase tracking-widest font-bold">Certificación de Servicio</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {!intervencion || !isValidToken ? (
          <Alert variant="destructive" className="mt-8">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Acceso Denegado</AlertTitle>
            <AlertDescription>
              El enlace es inválido o ha expirado. Por favor, solicite un nuevo enlace al técnico.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg text-primary text-sm font-medium">
              Usted está visualizando el expediente digital oficial de MEPROCENT. 
              {intervencion.locked ? ' Este documento ya ha sido certificado.' : ' Por favor, revise la ejecución y proceda a firmar la conformidad.'}
            </div>
            <PestControlDossier intervencion={intervencion} isPublic={true} />
          </div>
        )}
      </main>
      
      <footer className="mt-12 text-center text-muted-foreground text-xs">
        <p>© {new Date().getFullYear()} MEPROCENT Soluciones Industriales SRL</p>
        <p>Documento con validez legal y trazabilidad por token de seguridad.</p>
      </footer>
    </div>
  );
}
