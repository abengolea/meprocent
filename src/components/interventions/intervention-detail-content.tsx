'use client';

import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PestControlDossier } from '@/components/interventions/pest-control-dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, capitalize } from '@/lib/utils';
import type { Intervencion } from '@/lib/types';
import { ArrowLeft, Wrench, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface InterventionDetailContentProps {
  id: string;
  basePath?: string;
}

export function InterventionDetailContent({ id, basePath = '/intervenciones' }: InterventionDetailContentProps) {
  const db = useFirestore();
  const { profile } = useUser();
  const docRef = db && id ? doc(db, 'intervenciones', id) : null;
  const { data: intervencion, loading } = useDoc<Intervencion>(docRef);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!intervencion) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Intervención no encontrada.</p>
        <Button asChild><Link href={basePath}>Volver al listado</Link></Button>
      </div>
    );
  }

  const intervWithId = { ...intervencion, id } as Intervencion & { id: string };

  if (intervencion.vertical === 'pest_control') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={basePath}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Expediente de Fumigación</h1>
            <p className="text-sm text-muted-foreground">{intervencion.numeroIntervencion}</p>
          </div>
        </div>
        <PestControlDossier intervencion={intervWithId} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={basePath}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Intervención de Mantenimiento</h1>
          <p className="text-sm text-muted-foreground">{intervencion.numeroIntervencion}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={intervencion.estado === 'cerrada' ? 'outline' : 'default'}>
              {capitalize(intervencion.estado.replace(/_/g, ' '))}
            </Badge>
            <Badge variant="secondary">{capitalize(intervencion.tipoIntervencion)}</Badge>
            {intervencion.locked && (
              <Badge className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1" /> CERTIFICADO</Badge>
            )}
          </div>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            {intervencion.equipoSnapshot.descripcion}
          </CardTitle>
          <CardDescription>
            {intervencion.equipoSnapshot.codigoInterno} • {intervencion.equipoSnapshot.ubicacion}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Técnico</p>
              <p>{intervencion.tecnicoSnapshot.displayName}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Fecha</p>
              <p>{formatDate(intervencion.fechaInicio as any, 'PPp')}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
              <FileText className="w-4 h-4" /> Trabajo Realizado
            </p>
            <div className="mt-2 p-4 bg-muted/50 rounded-lg text-sm">
              {intervencion.trabajoRealizado || 'Sin descripción.'}
            </div>
          </div>
          {profile?.id === intervencion.tecnicoId && intervencion.estado !== 'cerrada' && (
            <Button asChild>
              <Link href={`/tecnico/trabajo/${id}/formulario`}>
                Completar formulario de trabajo
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
