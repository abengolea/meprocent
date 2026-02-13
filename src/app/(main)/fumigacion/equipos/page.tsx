import type { Metadata } from "next";
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EquipmentTableLoader } from '@/components/equipment/equipment-table-loader';
import type { Equipo } from "@/lib/types";

export const metadata: Metadata = {
  title: "Equipos de Fumigación | MEPROCENT",
  description: "Inventario de trampas y cebaderas para control de plagas.",
};

type PageProps = {
  searchParams?: { status?: Equipo['estadoActual'] };
};

export default function FumigacionEquiposPage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos de Fumigación</h1>
          <p className="text-muted-foreground">
            Inventario de trampas y cebaderas para control de plagas.
          </p>
        </div>
        <Button asChild>
          <Link href="/fumigacion/equipos/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Equipo
          </Link>
        </Button>
      </div>

      <EquipmentTableLoader status={searchParams?.status} vertical="pest_control" />
    </div>
  );
}
