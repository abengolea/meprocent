import type { Metadata } from "next";
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EquipmentTable } from '@/components/equipment/equipment-table';
import { getEquipos } from '@/lib/mock-data';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Equipos | MaintWise",
  description: "Gestión de inventario de equipos.",
};

export default function EquipmentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground">
            Inventario completo de equipos y maquinaria.
          </p>
        </div>
        <Button asChild>
          <Link href="/equipment/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Equipo
          </Link>
        </Button>
      </div>

      <Suspense fallback={<EquipmentTableSkeleton />}>
        <EquipmentLoader />
      </Suspense>
    </div>
  );
}

async function EquipmentLoader() {
    const equipos = await getEquipos();
    return <EquipmentTable equipos={equipos} />;
}

const EquipmentTableSkeleton = () => (
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)
