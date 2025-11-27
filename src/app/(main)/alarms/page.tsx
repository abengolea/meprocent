import type { Metadata } from "next";
import { AlarmsTable } from "@/components/alarms/alarms-table";
import { getAlarms } from "@/lib/mock-data";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alarma } from "@/lib/types";

export const metadata: Metadata = {
  title: "Alarmas | MaintWise",
  description: "Gestión de alarmas y notificaciones.",
};

type AlarmsPageProps = {
  searchParams?: {
    status?: 'activas' | Alarma['estado'];
    type?: Alarma['tipoAlarma'];
  };
};

export default function AlarmsPage({ searchParams }: AlarmsPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Alarmas</h1>
        <p className="text-muted-foreground">
          Monitorización de alarmas del sistema.
        </p>
      </div>

      <Suspense fallback={<AlarmsTableSkeleton />}>
        <AlarmsLoader status={searchParams?.status} type={searchParams?.type} />
      </Suspense>
    </div>
  );
}

async function AlarmsLoader({ status, type }: { status?: 'activas' | Alarma['estado'], type?: Alarma['tipoAlarma'] }) {
    let alarmas = await getAlarms();
    if (status === 'activas') {
        alarmas = alarmas.filter(a => a.estado === 'pendiente' || a.estado === 'en_progreso');
    } else if (status) {
        alarmas = alarmas.filter(a => a.estado === status);
    }
    if (type) {
        alarmas = alarmas.filter(a => a.tipoAlarma === type);
    }
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
