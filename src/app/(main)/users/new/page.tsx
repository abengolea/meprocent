import type { Metadata } from "next";
import { UserForm } from "@/components/users/user-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Nuevo Usuario | MaintWise",
    description: "Crear un nuevo usuario en el sistema.",
};

export default function NewUserPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Usuario</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para agregar un nuevo miembro a su empresa.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles del Usuario</CardTitle>
                    <CardDescription>
                        Proporcione la información del nuevo usuario y asigne un rol.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserForm />
                </CardContent>
            </Card>
        </div>
    );
}
