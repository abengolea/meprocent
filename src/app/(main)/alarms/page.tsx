import type { Metadata } from "next";
import { AlarmsTable } from "@/components/alarms/alarms-table";
import { getAlarms } from "@/lib/mock-data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/componentsui/table";

export const metadata: Metadata = {
  title: "Alarmas | MaintWise",
  description: "Gestión de alarmas y notificaciones.",
};

export default function AlarmsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alarmas</h1>
        <p className="text-muted-foreground">
          Monitorización de alarmas del sistema.
        </p>
      </div>

      <Suspense fallback={<AlarmsTableSkeleton />}>
        <AlarmsLoader />
      </Suspense>
    </div>
  );
}

async function AlarmsLoader() {
    const alarmas = await getAlarms();
    return <AlarmsTable alarmas={alarmas} />;
}

const AlarmsTableSkeleton = () => (
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">N° Alarma</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);
