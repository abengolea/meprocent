
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Nueva Intervención | MaintWise",
    description: "Crear una nueva intervención de mantenimiento.",
};

export default function NewInterventionPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nueva Intervención</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para registrar una nueva intervención.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Intervención</CardTitle>
                    <CardDescription>
                        (Formulario de intervención en desarrollo)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">Aquí irá el formulario para crear una nueva intervención, pre-cargando los datos desde la alarma si corresponde.</p>
                </CardContent>
            </Card>
        </div>
    );
}
