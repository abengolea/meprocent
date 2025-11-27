import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Configuración | MaintWise",
  description: "Configuración de la empresa y del sistema.",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Ajuste los parámetros operativos de su empresa.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>Esta sección está en desarrollo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center rounded-lg border-dashed py-16">
            <div className="flex flex-col items-center gap-4 text-center">
                <Settings className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                    Módulo de Configuración de Empresa
                </h3>
                <p className="text-sm text-muted-foreground">
                    Aquí podrá configurar horarios, aprobaciones, alarmas y más.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
