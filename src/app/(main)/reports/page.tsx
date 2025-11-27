import type { Metadata } from "next";
import { BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export const metadata: Metadata = {
  title: "Reportes | MaintWise",
  description: "Reportes y analíticas del sistema.",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes y Analíticas</h1>
        <p className="text-muted-foreground">
          Visualice el rendimiento y los datos clave de sus operaciones de mantenimiento.
        </p>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>Esta sección está en desarrollo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center rounded-lg border-dashed py-16">
            <div className="flex flex-col items-center gap-4 text-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                    Módulo de Reportes Avanzados
                </h3>
                <p className="text-sm text-muted-foreground">
                    Aquí podrá generar reportes de productividad, costos y cumplimiento.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
