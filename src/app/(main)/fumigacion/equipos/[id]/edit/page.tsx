import type { Metadata } from "next";
import { EquipmentEditLoader } from "@/components/equipment/equipment-edit-loader";

type Props = {
  params: { id: string };
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Editar Equipo | MEPROCENT`,
    description: `Editar la información del equipo de fumigación.`,
  };
}

export default function EditFumigacionEquipoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Equipo</h1>
        <p className="text-muted-foreground">
          Modifique los detalles del equipo de fumigación.
        </p>
      </div>
      <EquipmentEditLoader basePath="/fumigacion/equipos" />
    </div>
  );
}
