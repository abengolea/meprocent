"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Intervencion } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDate, capitalize } from "@/lib/utils";
import { Wrench, CheckCircle, Clock } from "lucide-react";

interface RecentInterventionsProps {
    intervenciones: Intervencion[];
}

export function RecentInterventions({ intervenciones }: RecentInterventionsProps) {
    const recentInterventions = intervenciones
        .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
        .slice(0, 5);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Intervenciones Recientes</CardTitle>
                    <CardDescription>Últimos trabajos de mantenimiento registrados.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/interventions">Ver todas</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {recentInterventions.length > 0 ? (
                    <ul className="space-y-4">
                        {recentInterventions.map(intervencion => (
                            <li key={intervencion.id} className="flex items-start gap-4">
                                <div className="mt-1">
                                    {intervencion.estadoCierre === 'cerrada' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Clock className="h-5 w-5 text-yellow-500" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium leading-tight">{intervencion.equipoSnapshot.descripcion}</p>
                                    <p className="text-sm text-muted-foreground">{capitalize(intervencion.tipoIntervencion)} por {intervencion.tecnicoSnapshot.displayName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{intervencion.numeroIntervencion}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(intervencion.fechaInicio, "PP")}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No hay intervenciones recientes.</p>
                )}
            </CardContent>
        </Card>
    );
}
