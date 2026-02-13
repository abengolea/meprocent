'use client';

import { useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { useParams, notFound } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EquipmentForm } from './equipment-form';
import type { Equipo } from '@/lib/types';

export function EquipmentEditLoader({ basePath = '/equipos' }: { basePath?: string }) {
  const params = useParams();
  const db = useFirestore();
  const id = typeof params?.id === 'string' ? params.id : '';

  const docRef = useMemo(() => (db && id ? doc(db, 'equipos', id) : null), [db, id]);
  const { data: equipo, loading, error } = useDoc<Equipo>(docRef);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !equipo) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Equipo</CardTitle>
        <CardDescription>
          Ajuste la información del equipo según sea necesario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EquipmentForm equipo={{ ...equipo, id } as Equipo} basePath={basePath} />
      </CardContent>
    </Card>
  );
}
