"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alarma } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { formatDate, capitalize } from "@/lib/utils";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface RecentAlarmsProps {
    alarms: Alarma[];
}

export function RecentAlarms({ alarms }: RecentAlarmsProps) {
    const toDate = (d: unknown) => (d && typeof d === 'object' && 'toMillis' in d ? (d as { toMillis: () => number }).toMillis() : d);
    const recentAlarms = alarms
        .filter(a => a.estado === 'pendiente' || a.estado === 'en_progreso')
        .sort((a, b) => new Date(toDate(b.fechaGeneracion) || 0).getTime() - new Date(toDate(a.fechaGeneracion) || 0).getTime())
        .slice(0, 5);
        
    const getSeverityVariant = (severity: Alarma['severidad']) => {
        switch (severity) {
            case 'critica': return 'destructive';
            case 'alta': return 'default';
            case 'media': return 'secondary';
            case 'baja': return 'outline';
            default: return 'secondary';
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Alarmas Recientes</CardTitle>
                    <CardDescription>Alertas que requieren atención prioritaria.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/alarmas">Ver todas</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {recentAlarms.length > 0 ? (
                    <ul className="space-y-4">
                        {recentAlarms.map(alarma => (
                            <li key={alarma.id} className="flex items-center gap-4">
                                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="font-medium leading-none">{alarma.titulo}</p>
                                    <p className="text-sm text-muted-foreground">{alarma.equipoSnapshot?.descripcion || '—'}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={getSeverityVariant(alarma.severidad)}>{capitalize(alarma.severidad)}</Badge>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDate(alarma.fechaGeneracion, "dd MMM")}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <Link href={`/alarmas/${alarma.id}`}><ChevronRight className="h-4 w-4" /></Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No hay alarmas recientes.</p>
                )}
            </CardContent>
        </Card>
    );
}
