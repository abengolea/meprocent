"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Siren, Wrench, Users } from "lucide-react";
import type { Alarma, Equipo, Intervencion, User } from "@/lib/types";
import { isWithinInterval, startOfMonth } from "date-fns";
import { formatDate } from "@/lib/utils";

interface StatsCardsProps {
    equipos: Equipo[];
    alarmas: Alarma[];
    intervenciones: Intervencion[];
    usuarios: User[];
}

export function StatsCards({ equipos, alarmas, intervenciones, usuarios }: StatsCardsProps) {
    const operativos = equipos.filter(e => e.estadoActual === 'operativo').length;
    
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const intervencionesMes = intervenciones.filter(i => 
        isWithinInterval(new Date(i.fechaInicio as Date), { start: startOfCurrentMonth, end: now })
    ).length;

    const alarmasActivas = alarmas.filter(a => a.estado === 'pendiente' || a.estado === 'en_progreso').length;
    
    const tecnicos = usuarios.filter(u => u.role === 'tecnico' || u.role === 'tecnico_senior');
    const tecnicosActivos = tecnicos.filter(u => u.activo).length;

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
            title: "Intervenciones (Mes)",
            icon: Wrench,
            value: intervencionesMes,
            description: `desde el ${formatDate(startOfCurrentMonth, 'dd/MM/yyyy')}`,
            href: "/interventions",
            textColor: ""
        },
        {
            title: "Alarmas Activas",
            icon: Siren,
            value: alarmasActivas,
            description: "Requieren atención inmediata",
            href: "/alarms?status=activas",
            textColor: alarmasActivas > 0 ? "text-destructive" : ""
        },
        {
            title: "Técnicos Activos",
            icon: Users,
            value: `${tecnicosActivos}/${tecnicos.length}`,
            description: "Usuarios con rol de técnico",
            href: "/users?role=tecnico",
            textColor: ""
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
