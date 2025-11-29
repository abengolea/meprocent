
import type { Metadata } from "next";
import { EmpresaForm } from "@/components/empresas/empresa-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Nueva Empresa | MaintWise",
    description: "Agregar una nueva empresa o cliente al sistema.",
};

export default function NewEmpresaPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Agregar Nueva Empresa</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para registrar un nuevo cliente en el sistema.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Datos de la Empresa</CardTitle>
                    <CardDescription>
                        Proporcione la información fiscal y comercial de la nueva empresa.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmpresaForm />
                </CardContent>
            </Card>
        </div>
    );
}
