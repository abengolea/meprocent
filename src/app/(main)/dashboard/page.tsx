import type { Metadata } from "next";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { getAlarms, getIntervenciones } from "@/lib/mock-data";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Dashboard | MaintWise",
    description: "Visión general de sus tareas y alarmas.",
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard del Técnico</h1>
                <p className="text-muted-foreground">
                    Un resumen de sus tareas y alarmas asignadas.
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
