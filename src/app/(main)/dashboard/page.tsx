import type { Metadata } from "next";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentAlarms } from "@/components/dashboard/recent-alarms";
import { RecentInterventions } from "@/components/dashboard/recent-interventions";
import { getAlarms, getEquipos, getIntervenciones, mockUsers } from "@/lib/mock-data";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart } from "lucide-react";

export const metadata: Metadata = {
    title: "Dashboard | MaintWise",
    description: "Visión general del sistema de mantenimiento.",
};

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard del Administrador</h1>
                <p className="text-muted-foreground">
                    Un resumen del estado actual de su empresa.
                </p>
            </header>
            
            <Suspense fallback={<StatsSkeleton />}>
                <StatsCardsLoader />
            </Suspense>

            <Card>
              <CardHeader>
                <CardTitle>Métricas del Mes</CardTitle>
                <CardDescription>Visualización del rendimiento y operaciones clave.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg">
                    <PieChart className="w-12 h-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Intervenciones por Tipo</p>
                    <p className="text-xs text-muted-foreground">(Gráfico de ejemplo)</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg">
                    <LineChart className="w-12 h-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Cumplimiento Preventivo</p>
                     <p className="text-xs text-muted-foreground">(Gráfico de ejemplo)</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg">
                    <BarChart className="w-12 h-12 text-muted-foreground" />
                    <p className="text-sm font-medium">Equipos con más fallas</p>
                     <p className="text-xs text-muted-foreground">(Gráfico de ejemplo)</p>
                </div>
              </CardContent>
            </Card>

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

async function StatsCardsLoader() {
    const [equipos, alarmas, intervenciones] = await Promise.all([
        getEquipos(),
        getAlarms(),
        getIntervenciones()
    ]);
    const usuarios = mockUsers;
    return <StatsCards equipos={equipos} alarmas={alarmas} intervenciones={intervenciones} usuarios={usuarios} />;
}

async function RecentAlarmsLoader() {
    const alarmas = await getAlarms();
    return <RecentAlarms alarms={alarmas} />;
}

async function RecentInterventionsLoader() {
    const intervenciones = await getIntervenciones();
    return <RecentInterventions intervenciones={intervenciones} />;
}

const StatsSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipos Operativos</CardTitle>
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-1" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Intervenciones (Mes)</CardTitle>
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-1" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alarmas Activas</CardTitle>
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-1" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Técnicos Activos</CardTitle>
                <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32 mt-1" />
            </CardContent>
        </Card>
    </div>
);

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
