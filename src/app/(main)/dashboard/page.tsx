
'use client';

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { DashboardTecnico } from "@/components/tecnico/dashboard-tecnico";
import { Intervencion } from "@/lib/types";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";

export default function DashboardPage() {
    const { profile, loading: userLoading } = useUser();
    const db = useFirestore();

    // Query para intervenciones (si es técnico, solo las suyas)
    const interventionsQuery = profile?.role === 'admin' 
        ? query(collection(db, "intervenciones"), orderBy("fechaInicio", "desc"))
        : query(collection(db, "intervenciones"), where("tecnicoId", "==", profile?.id || ""), orderBy("fechaInicio", "desc"));

    const { data: intervenciones, loading: dataLoading } = useCollection<Intervencion>(db ? interventionsQuery : null);

    if (userLoading) return <DashboardSkeleton />;
    if (!profile) return <div>Inicie sesión para continuar.</div>;

    // Vista para Admin/Supervisor
    if (profile.role === 'admin' || profile.role === 'supervisor') {
        return (
             <div className="flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
                    <p className="text-muted-foreground">
                        Métricas de mantenimiento y control de plagas.
                    </p>
                </header>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* Aquí irían más componentes de métricas reales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecentInterventions intervenciones={intervenciones || []} />
                        <RecentAlarms alarms={[]} /> {/* TODO: Conectar a Firestore */}
                    </div>
                </div>
            </div>
        );
    }
    
    // Dashboard del Técnico
    return (
        <DashboardTecnico user={profile} intervenciones={intervenciones || []} />
    );
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
);
