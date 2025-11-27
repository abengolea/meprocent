"use client";

import Link from "next/link";
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

    const cardItems = [
        {
            title: "Equipos Operativos",
            icon: HardHat,
            value: operativos,
            description: `de ${equipos.length} equipos totales`,
            href: "/equipment?status=operativo",
            textColor: ""
        },
        {
            title: "Alarmas Activas",
            icon: Siren,
            value: alarmasActivas,
            description: "Requieren atención",
            href: "/alarms?status=activas",
            textColor: ""
        },
        {
            title: "Intervenciones Pendientes",
            icon: Wrench,
            value: intervencionesPendientes,
            description: "Trabajos en curso o por iniciar",
            href: "/interventions?status=abierta",
            textColor: ""
        },
        {
            title: "Mantenimientos Vencidos",
            icon: AlertTriangle,
            value: mantenimientosVencidos,
            description: "Planes de mantenimiento atrasados",
            href: "/alarms?type=mantenimiento_vencido",
            textColor: "text-destructive"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cardItems.map((item) => (
                <Link href={item.href} key={item.title}>
                    <Card className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                            <item.icon className={`h-4 w-4 text-muted-foreground ${item.textColor && 'text-destructive'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${item.textColor}`}>{item.value}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
