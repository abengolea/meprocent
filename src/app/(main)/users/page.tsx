import type { Metadata } from "next";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Usuarios | MaintWise",
  description: "Gestión de usuarios del sistema.",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Cree, edite y gestione los roles y permisos de los usuarios de su empresa.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Próximamente</CardTitle>
            <CardDescription>Esta sección está en desarrollo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center rounded-lg border-dashed py-16">
            <div className="flex flex-col items-center gap-4 text-center">
                <Users className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                    Módulo de Gestión de Usuarios
                </h3>
                <p className="text-sm text-muted-foreground">
                    Aquí podrá añadir, editar y asignar roles a los miembros de su equipo.
                </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
