'use client';

import { useMemo } from 'react';
import { doc, collection, query, where, orderBy } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HardHat, Bot, FileText, ChevronRight, Pencil, PlusCircle } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { QrCodeCard } from './qr-code-card';
import { EquipmentDetailsCard } from './equipment-details-card';
import { EquipmentInterventionsHistory } from './equipment-interventions-history';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Equipo, Intervencion } from '@/lib/types';

export function EquipmentDetailLoader({ basePath = '/equipos' }: { basePath?: string }) {
  const params = useParams();
  const db = useFirestore();
  const id = typeof params?.id === 'string' ? params.id : '';

  const docRef = useMemo(() => (db && id ? doc(db, 'equipos', id) : null), [db, id]);
  const { data: equipo, loading, error } = useDoc<Equipo>(docRef);

  const intervencionesQuery = useMemo(() => {
    if (!db || !id) return null;
    return query(
      collection(db, 'intervenciones'),
      where('equipoId', '==', id),
      orderBy('fechaInicio', 'desc')
    );
  }, [db, id]);

  const { data: intervenciones } = useCollection<Intervencion>(intervencionesQuery);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !equipo) {
    notFound();
  }

  const equipoWithId = { ...equipo, id } as Equipo;
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'operativo': return 'default';
      case 'fuera_de_servicio': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <HardHat className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{equipo.descripcion}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{equipo.codigoInterno}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{capitalize(equipo.tipoEquipo.replace('_', ' '))}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant={getStatusVariant(equipo.estadoActual ?? 'operativo')} className="text-sm">
            {capitalize((equipo.estadoActual ?? 'operativo').replace(/_/g, ' '))}
          </Badge>
          <Button asChild size="sm">
            <Link href={`${basePath.replace('/equipos', '/intervenciones')}/new?equipoId=${id}`}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Intervención
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EquipmentDetailsCard equipo={equipoWithId} />
          <EquipmentInterventionsHistory
            intervenciones={intervenciones ?? []}
            basePath={basePath.replace('/equipos', '/intervenciones')}
          />
        </div>
        <div className="space-y-6">
          <QrCodeCard equipo={equipoWithId} basePath={basePath} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5"/>
                Análisis Predictivo IA
              </CardTitle>
              <CardDescription>Use IA para predecir fallas y optimizar el mantenimiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analice los datos históricos de este equipo para obtener recomendaciones inteligentes.
              </p>
              <Button asChild className="w-full">
                <Link href={`${basePath}/${id}/analysis`}>
                  Iniciar Análisis con IA
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5"/>
                Planes de Mantenimiento
              </CardTitle>
              <CardDescription>Planes asociados a este equipo.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No hay planes de mantenimiento asociados.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
