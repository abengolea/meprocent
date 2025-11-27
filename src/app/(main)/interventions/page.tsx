import type { Metadata } from "next";
import { InterventionsTable } from "@/components/interventions/interventions-table";
import { getIntervenciones } from "@/lib/mock-data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export const metadata: Metadata = {
  title: "Intervenciones | MaintWise",
  description: "Historial de intervenciones de mantenimiento.",
};

export default function InterventionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intervenciones</h1>
        <p className="text-muted-foreground">
          Registro histórico de todas las intervenciones de mantenimiento.
        </p>
      </div>
      <Suspense fallback={<InterventionsTableSkeleton />}>
        <InterventionsLoader />
      </Suspense>
    </div>
  );
}

async function InterventionsLoader() {
    const intervenciones = await getIntervenciones();
    return <InterventionsTable intervenciones={intervenciones} />;
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
