
import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockUsers, getIntervenciones } from "@/lib/mock-data";
import { User, Intervencion } from "@/lib/types";
import { DashboardTecnico } from "@/components/tecnico/dashboard-tecnico";

export const metadata: Metadata = {
    title: "Dashboard | MaintWise",
    description: "Visión general de sus tareas y alarmas.",
};

const userRole = 'tecnico'; 

const getCurrentUser = (): User => {
    if (userRole === 'admin') return mockUsers[0];
    if (userRole === 'supervisor') return mockUsers[1];
    return mockUsers.find(u => u.role === 'tecnico')!; // Aseguramos que sea un técnico
}

export default function DashboardPage() {
    const user = getCurrentUser();

    // Vistas para otros roles
    if (user.role === 'admin' || user.role === 'supervisor') {
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
    
    // Dashboard del Técnico
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardTecnicoLoader user={user} />
        </Suspense>
    );
}

async function DashboardTecnicoLoader({ user }: { user: User }) {
    // En una app real, aquí se filtrarían las intervenciones por `user.id` y fecha.
    const intervenciones = await getIntervenciones(); 
    return <DashboardTecnico user={user} intervenciones={intervenciones} />;
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="flex justify-around">
                <div className="text-center"><Skeleton className="h-8 w-10 mx-auto" /><Skeleton className="h-4 w-16 mt-2" /></div>
                <div className="text-center"><Skeleton className="h-8 w-10 mx-auto" /><Skeleton className="h-4 w-16 mt-2" /></div>
                <div className="text-center"><Skeleton className="h-8 w-10 mx-auto" /><Skeleton className="h-4 w-16 mt-2" /></div>
            </CardContent>
        </Card>
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-24 w-full" />
        </div>
    </div>
);
