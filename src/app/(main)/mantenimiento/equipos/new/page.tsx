import type { Metadata } from "next";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nuevo Equipo de Mantenimiento | MEPROCENT",
  description: "Registrar equipo industrial.",
};

export default function NewMantenimientoEquipoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Equipo de Mantenimiento</h1>
        <p className="text-muted-foreground">
          Registre motores, bombas, tableros eléctricos, UPS o transformadores.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Equipo</CardTitle>
          <CardDescription>
            Proporcione la información del equipo industrial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm basePath="/mantenimiento/equipos" />
        </CardContent>
      </Card>
    </div>
  );
}
