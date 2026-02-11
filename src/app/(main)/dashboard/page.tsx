
'use client';

import { useState, useMemo } from "react";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { DashboardTecnico } from "@/components/tecnico/dashboard-tecnico";
import { Intervencion, Equipo, User } from "@/lib/types";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { StatsCards } from "@/components/dashboard/stats-cards";
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

    // Queries reales
    const interventionsQuery = useMemo(() => {
        if (!db || !profile) return null;
        if (profile.role === 'admin' || profile.role === 'super_admin' || profile.role === 'supervisor') {
            return query(collection(db, "intervenciones"), orderBy("fechaInicio", "desc"), limit(10));
        }
        return query(collection(db, "intervenciones"), where("tecnicoId", "==", profile.id), orderBy("fechaInicio", "desc"), limit(10));
    }, [db, profile]);

    const equiposQuery = useMemo(() => {
        if (!db || !profile) return null;
        return query(collection(db, "equipos"));
    }, [db, profile]);

    const { data: intervenciones, loading: dataLoading } = useCollection<Intervencion>(interventionsQuery);
    const { data: equipos } = useCollection<Equipo>(equiposQuery);

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
    if (!profile) return <div className="p-8 text-center">Inicie sesión para continuar.</div>;

    const isStaff = ['admin', 'super_admin', 'supervisor'].includes(profile.role);

    if (isStaff) {
        const isEmpty = !dataLoading && (!intervenciones || intervenciones.length === 0);

        return (
             <div className="flex flex-col gap-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Panel Administrativo</h1>
                        <p className="text-muted-foreground">
                            Resumen de gestión industrial para {profile.empresaId === 'meprocent-admin' ? 'MEPROCENT Global' : profile.empresaId}.
                        </p>
                    </div>
                    {isEmpty && (
                        <Button onClick={handleSeed} disabled={seeding} variant="outline">
                            {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                            Cargar Datos de Prueba
                        </Button>
                    )}
                </header>
                
                <StatsCards 
                    equipos={equipos || []} 
                    alarmas={[]} 
                    intervenciones={intervenciones || []} 
                    usuarios={[]} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecentInterventions intervenciones={intervenciones || []} />
                    <RecentAlarms alarms={[]} />
                </div>
            </div>
        );
    }
    
    return (
        <DashboardTecnico user={profile} intervenciones={intervenciones || []} />
    );
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
);
