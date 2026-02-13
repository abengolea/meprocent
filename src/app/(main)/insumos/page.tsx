'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InsumosTable } from '@/components/insumos/insumos-table';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Insumo } from '@/lib/types';

export default function InsumosPage() {
  const { profile } = useUser();
  const db = useFirestore();

  const insumosQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') {
      return collection(db, 'insumos');
    }
    return query(collection(db, 'insumos'), where('empresaId', '==', profile.empresaId));
  }, [db, profile]);

  const { data: insumos, loading } = useCollection<Insumo>(insumosQuery);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Insumos</h1>
          <p className="text-muted-foreground">
            Productos químicos, materiales y repuestos para intervenciones de fumigación y mantenimiento.
          </p>
        </div>
        <Button asChild>
          <Link href="/insumos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Insumo
          </Link>
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : (
        <InsumosTable insumos={insumos || []} />
      )}
    </div>
  );
}
