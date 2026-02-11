
'use client';

import { Intervencion } from "@/lib/types";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy, where } from "firebase/firestore";
import { InterventionsTable } from "@/components/interventions/interventions-table";
import { Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function InterventionsPage({ searchParams }: { searchParams?: { status?: string } }) {
  const db = useFirestore();
  
  const interventionsQuery = useMemo(() => {
    if (!db) return null;
    let q = query(collection(db, "intervenciones"), orderBy("fechaInicio", "desc"));
    if (searchParams?.status) {
      q = query(q, where("estado", "==", searchParams.status));
    }
    return q;
  }, [db, searchParams?.status]);

  const { data: intervenciones, loading } = useCollection<Intervencion>(interventionsQuery);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intervenciones</h1>
        <p className="text-muted-foreground">
          Registro histórico de todas las intervenciones de mantenimiento y control de plagas.
        </p>
      </div>
      
      {loading ? (
        <InterventionsTableSkeleton />
      ) : (
        <InterventionsTable intervenciones={intervenciones || []} />
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
