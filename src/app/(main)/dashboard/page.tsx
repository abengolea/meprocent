'use client';

import { useState } from "react";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { DashboardTecnico } from "@/components/tecnico/dashboard-tecnico";
import { Intervencion } from "@/lib/types";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import { seedDatabase } from "@/lib/db-seed";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const { profile, loading: userLoading } = useUser();
    const db = useFirestore();
    const { toast } = useToast();
    const [seeding, setSeeding] = useState(false);

    // Query para intervenciones (si es técnico, solo las suyas)
    const interventionsQuery = profile?.role === 'admin' || profile?.role === 'supervisor'
        ? query(collection(db, "intervenciones"), orderBy("fechaInicio", "desc"), limit(10))
        : query(collection(db, "intervenciones"), where("tecnicoId", "==", profile?.id || ""), orderBy("fechaInicio", "desc"), limit(10));

    const { data: intervenciones, loading: dataLoading } = useCollection<Intervencion>(db ? interventionsQuery : null);

    const handleSeed = async () => {
        if (!db || !profile) return;
        setSeeding(true);
        try {
            await seedDatabase(db, profile.empresaId, profile.id, profile.displayName);
            toast({ title: "Datos Sembrados", description: "Se han cargado equipos e intervenciones de prueba." });
        } catch (e) {
            console.error(e);
            toast({ variant: "destructive", title: "Error", description: "No se pudo sembrar la base de datos." });
        } finally {
            setSeeding(false);
        }
    }

    if (userLoading) return <DashboardSkeleton />;
    if (!profile) return <div>Inicie sesión para continuar.</div>;

    // Vista para Admin/Supervisor
    if (profile.role === 'admin' || profile.role === 'supervisor') {
        const isEmpty = !dataLoading && (!intervenciones || intervenciones.length === 0);

        return (
             <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
                        <p className="text-muted-foreground">
                            Métricas de mantenimiento y control de plagas para {profile.empresaId}.
                        </p>
                    </div>
                    {isEmpty && (
                        <Button onClick={handleSeed} disabled={seeding} variant="outline">
                            {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                            Cargar Datos de Prueba
                        </Button>
                    )}
                </header>
                
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RecentInterventions intervenciones={intervenciones || []} />
                        <RecentAlarms alarms={[]} />
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
