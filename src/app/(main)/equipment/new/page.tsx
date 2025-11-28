
import type { Metadata } from "next";
import { EquipmentForm } from "@/components/equipment/equipment-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Nuevo Equipo | MaintWise",
    description: "Agregar un nuevo equipo al inventario del sistema.",
};

export default function NewEquipmentPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Equipo</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para registrar una nueva pieza de equipo o maquinaria.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Equipo</CardTitle>
                    <CardDescription>
                        Proporcione la información principal del equipo. Campos adicionales podrán ser agregados luego.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EquipmentForm />
                </CardContent>
            </Card>
        </div>
    );
}
