'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { InsumoForm } from '@/components/insumos/insumo-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Insumo } from '@/lib/types';

export default function EditInsumoPage() {
  const params = useParams();
  const db = useFirestore();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const docRef = db && id ? doc(db, 'insumos', id) : null;
  const { data: insumo, loading } = useDoc<Insumo>(docRef);

  if (loading || !insumo) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Insumo</h1>
        <p className="text-muted-foreground">
          Modifique los datos del producto {insumo.internalCode}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Insumo</CardTitle>
          <CardDescription>
            Actualice la información del producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InsumoForm insumo={{ ...insumo, id } as Insumo} />
        </CardContent>
      </Card>
    </div>
  );
}
