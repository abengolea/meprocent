
'use client';

import type { Metadata } from "next";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionForm } from "@/components/interventions/intervention-form";
import { Skeleton } from "@/components/ui/skeleton";

// Metadata cannot be dynamic in a client component, but we keep a static one.
// export const metadata: Metadata = {
//     title: "Nueva Intervención | MaintWise",
//     description: "Crear una nueva intervención de mantenimiento.",
// };

function NewInterventionPageContent() {
    const searchParams = useSearchParams();
    const alarmId = searchParams.get('alarmId');
    const equipoId = searchParams.get('equipoId');

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Crear Nueva Intervención</h1>
                <p className="text-muted-foreground">
                    Complete el formulario para registrar una nueva intervención.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Intervención</CardTitle>
                    <CardDescription>
                        Proporcione la información necesaria para la nueva tarea de mantenimiento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <InterventionForm alarmId={alarmId} equipoId={equipoId} />
                </CardContent>
            </Card>
        </div>
    );
}

const FormSkeleton = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
        </div>
    </div>
);


export default function NewInterventionPage() {
    return (
        <Suspense fallback={<FormSkeleton />}>
            <NewInterventionPageContent />
        </Suspense>
    );
}
