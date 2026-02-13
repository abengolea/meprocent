import type { Metadata } from "next";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nuevo Equipo de Fumigación | MEPROCENT",
  description: "Registrar trampa o cebadera.",
};

export default function NewFumigacionEquipoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Equipo de Fumigación</h1>
        <p className="text-muted-foreground">
          Registre trampas o cebaderas para control de plagas.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Equipo</CardTitle>
          <CardDescription>
            Proporcione la información de la trampa o cebadera.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentForm basePath="/fumigacion/equipos" />
        </CardContent>
      </Card>
    </div>
  );
}
