"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanMantenimiento } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { ClipboardList, Users, Clock } from "lucide-react";

interface PlansListProps {
    planes: PlanMantenimiento[];
}

export function PlansList({ planes }: PlansListProps) {
    if (!planes.length) {
        return (
            <Card>
                <div className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No hay planes de mantenimiento</h3>
                    <p className="text-muted-foreground">Cree su primer plan de mantenimiento para comenzar.</p>
                </div>
            </Card>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planes.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-3">
                            <ClipboardList className="h-6 w-6 text-primary flex-shrink-0 mt-1"/>
                            <span>{plan.nombrePlan}</span>
                        </CardTitle>
                        <CardDescription>{plan.descripcion}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="space-y-3 text-sm">
                             <div className="flex items-center gap-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>Aplica a: {capitalize(plan.aplicabilidad.tipoEquipo?.join(', ').replace('_', ' ') || 'N/A')}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Frecuencia: Cada {plan.frecuencia.valor} {plan.frecuencia.tipo}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
