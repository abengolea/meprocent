'use client';

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterventionForm } from "@/components/interventions/intervention-form";
import { Skeleton } from "@/components/ui/skeleton";

function NewFumigacionInterventionContent() {
  const searchParams = useSearchParams();
  const alarmId = searchParams.get('alarmId');
  const equipoId = searchParams.get('equipoId');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nueva Intervención de Fumigación</h1>
        <p className="text-muted-foreground">
          Servicio de fumigación o control de plagas en trampa o cebadera.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Intervención</CardTitle>
          <CardDescription>
            Proporcione la información del servicio de fumigación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterventionForm alarmId={alarmId} equipoId={equipoId} defaultVertical="pest_control" redirectBasePath="/fumigacion/intervenciones" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewFumigacionInterventionPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <NewFumigacionInterventionContent />
    </Suspense>
  );
}
