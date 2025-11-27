import type { Metadata } from "next";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { getAlarms, getIntervenciones, mockUsers } from "@/lib/mock-data";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";

export const metadata: Metadata = {
    title: "Dashboard | MaintWise",
    description: "Visión general de sus tareas y alarmas.",
};

// Simulamos que el rol del usuario se obtiene de una sesión
const userRole = 'tecnico'; 

const getCurrentUser = (): User => {
    if (userRole === 'admin') return mockUsers[0];
    if (userRole === 'supervisor') return mockUsers[1];
    return mockUsers[2]; // tecnico
}

export default function DashboardPage() {
    const user = getCurrentUser();

    if (user.role === 'admin' || user.role === 'supervisor') {
        // Redirigir o mostrar un dashboard diferente para admin/supervisor
        // Por ahora, mantendremos la lógica del dashboard de admin si no es técnico
        return (
             <div className="flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard del Administrador</h1>
                    <p className="text-muted-foreground">
                        Visión general de las métricas y estado del sistema.
                    </p>
                </header>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo, {user.displayName.split(' ')[0]}</h1>
                <p className="text-muted-foreground">
                    Aquí tienes un resumen de tus tareas y alarmas asignadas.
                </p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<CardSkeleton />}>
                    <RecentAlarmsLoader />
                </Suspense>
                <Suspense fallback={<CardSkeleton />}>
                    <RecentInterventionsLoader />
                </Suspense>
            </div>
        </div>
    );
}

async function RecentAlarmsLoader() {
    const alarmas = await getAlarms();
    // En una app real, filtraríamos las alarmas asignadas a este técnico
    return <RecentAlarms alarms={alarmas} />;
}

async function RecentInterventionsLoader() {
    const intervenciones = await getIntervenciones();
    // En una app real, filtraríamos las intervenciones asignadas a este técnico
    return <RecentInterventions intervenciones={intervenciones} />;
}

const CardSkeleton = () => (
    <Card>
        <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </CardContent>
    </Card>
);
