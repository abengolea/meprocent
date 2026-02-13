import type { Metadata } from "next";
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EquipmentTableLoader } from '@/components/equipment/equipment-table-loader';
import { Equipo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Equipos de Mantenimiento | MEPROCENT",
  description: "Inventario de equipos industriales (motores, bombas, tableros, etc.).",
};

type PageProps = {
  searchParams?: { status?: Equipo['estadoActual'] };
};

export default function MantenimientoEquiposPage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos de Mantenimiento</h1>
          <p className="text-muted-foreground">
            Inventario de equipos industriales: motores, bombas, tableros, UPS, transformadores.
          </p>
        </div>
        <Button asChild>
          <Link href="/mantenimiento/equipos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Equipo
          </Link>
        </Button>
      </div>

      <EquipmentTableLoader status={searchParams?.status} vertical="maintenance" />
    </div>
  );
}
