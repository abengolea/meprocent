'use client';

import { Intervencion } from "@/lib/types";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";
import { InterventionsTable } from "@/components/interventions/interventions-table";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function MantenimientoIntervencionesPage({ searchParams }: { searchParams?: { status?: string } }) {
  const db = useFirestore();
  const { profile } = useUser();

  const interventionsQuery = useMemo(() => {
    if (!db) return null;
    let q = query(
      collection(db, "intervenciones"),
      where("vertical", "==", "maintenance"),
      orderBy("fechaInicio", "desc")
    );
    if (searchParams?.status) {
      q = query(q, where("estado", "==", searchParams.status));
    }
    return q;
  }, [db, searchParams?.status]);

  const { data: rawIntervenciones, loading } = useCollection<Intervencion>(interventionsQuery);
  const intervenciones = useMemo(() => {
    if (!rawIntervenciones) return [];
    if (profile?.role === 'super_admin') return rawIntervenciones;
    return rawIntervenciones.filter(i => i.empresaId === profile?.empresaId);
  }, [rawIntervenciones, profile?.empresaId, profile?.role]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intervenciones de Mantenimiento</h1>
          <p className="text-muted-foreground">
            Correctivo, preventivo e inspección de equipos industriales.
          </p>
        </div>
        <Button asChild>
          <Link href="/mantenimiento/intervenciones/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Intervención
          </Link>
        </Button>
      </div>

      {loading ? (
        <InterventionsTableSkeleton />
      ) : (
        <InterventionsTable intervenciones={intervenciones} basePath="/mantenimiento/intervenciones" />
      )}
    </div>
  );
}

const InterventionsTableSkeleton = () => (
  <div className="rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">N° Intervención</TableHead>
          <TableHead>Equipo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Técnico</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
