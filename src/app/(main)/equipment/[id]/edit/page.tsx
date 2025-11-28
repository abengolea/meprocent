import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEquipoById } from "@/lib/mock-data";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const equipo = await getEquipoById(params.id);
  if (!equipo) return { title: "Editar Equipo" };
  return {
    title: `Editar: ${equipo.codigoInterno} | MaintWise`,
    description: `Editando la información del equipo ${equipo.descripcion}.`,
  };
}


export default async function EditEquipmentPage({ params }: Props) {
    const equipo = await getEquipoById(params.id);

    if (!equipo) {
        notFound();
    }
    
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Equipo</h1>
                <p className="text-muted-foreground">
                    Modifique los detalles del equipo <span className="font-semibold text-foreground">{equipo.descripcion} ({equipo.codigoInterno})</span>.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Equipo</CardTitle>
                    <CardDescription>
                        Ajuste la información del equipo según sea necesario.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EquipmentForm equipo={equipo} />
                </CardContent>
            </Card>
        </div>
    );
}
