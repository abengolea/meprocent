"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Siren, Wrench, AlertTriangle } from "lucide-react";
import type { Alarma, Equipo, Intervencion } from "@/lib/types";

interface StatsCardsProps {
    equipos: Equipo[];
    alarmas: Alarma[];
    intervenciones: Intervencion[];
}

export function StatsCards({ equipos, alarmas, intervenciones }: StatsCardsProps) {
    const operativos = equipos.filter(e => e.estadoActual === 'operativo').length;
    const alarmasActivas = alarmas.filter(a => a.estado === 'pendiente' || a.estado === 'en_progreso').length;
    const intervencionesPendientes = intervenciones.filter(i => i.estadoCierre === 'abierta').length;
    const mantenimientosVencidos = alarmas.filter(a => a.tipoAlarma === 'mantenimiento_vencido' && a.estado !== 'resuelta').length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Equipos Operativos</CardTitle>
                    <HardHat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{operativos}</div>
                    <p className="text-xs text-muted-foreground">de {equipos.length} equipos totales</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alarmas Activas</CardTitle>
                    <Siren className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{alarmasActivas}</div>
                    <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Intervenciones Pendientes</CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{intervencionesPendientes}</div>
                    <p className="text-xs text-muted-foreground">Trabajos en curso o por iniciar</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mantenimientos Vencidos</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{mantenimientosVencidos}</div>
                    <p className="text-xs text-muted-foreground">Planes de mantenimiento atrasados</p>
                </CardContent>
            </Card>
        </div>
    )
}
