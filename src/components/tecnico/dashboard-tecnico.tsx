"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QrCode, Play, Wrench, CheckCircle, Clock } from 'lucide-react';
import type { User, Intervencion } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { isToday } from 'date-fns';

interface DashboardTecnicoProps {
    user: User;
    intervenciones: Intervencion[];
}

interface TrabajosClasificados {
    pendientes: Intervencion[];
    enProgreso: Intervencion[];
    completadosHoy: Intervencion[];
}

export function DashboardTecnico({ user, intervenciones }: DashboardTecnicoProps) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const trabajosHoy = useMemo((): TrabajosClasificados => {
        const misIntervenciones = intervenciones.filter(
            (t) => t.tecnicoId === user.id && ['asignada', 'en_progreso', 'pausada', 'completada_tecnico', 'aprobada', 'cerrada'].includes(t.estado)
        );

        const fechaHoy = (d: unknown) => {
            if (!d) return false;
            const ms = typeof d === 'object' && d !== null && 'toMillis' in d ? (d as { toMillis: () => number }).toMillis() : d;
            return isToday(new Date(ms));
        };

        return {
            pendientes: misIntervenciones.filter((t) => t.estado === 'asignada'),
            enProgreso: misIntervenciones.filter((t) => t.estado === 'en_progreso' || t.estado === 'pausada'),
            completadosHoy: misIntervenciones.filter(
                (t) =>
                    (t.estado === 'aprobada' || t.estado === 'cerrada' || t.estado === 'completada_tecnico') &&
                    (fechaHoy(t.closedAt) || fechaHoy(t.fechaInicio))
            ),
        };
    }, [intervenciones, user.id]);

    const totalTrabajos = trabajosHoy.pendientes.length + trabajosHoy.enProgreso.length;
    
    if (!currentTime) {
        return null; // O un esqueleto de carga
    }

    return (
        <div className="flex flex-col gap-6 pb-8">
            <header className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">👋 Hola, {user.displayName.split(' ')[0]}</h1>
                <p className="text-muted-foreground text-sm">
                    {formatDate(currentTime, 'eeee, d \'de\' MMMM \'de\' yyyy')} | {formatDate(currentTime, 'p')}
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Mis Trabajos ({totalTrabajos})</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around text-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">{trabajosHoy.enProgreso.length}</p>
                        <p className="text-xs text-muted-foreground">En progreso</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{trabajosHoy.pendientes.length}</p>
                        <p className="text-xs text-muted-foreground">Pendientes</p>
                    </div>
                </CardContent>
            </Card>

            <Button size="lg" className="h-16 text-lg font-bold">
                <QrCode className="mr-4 h-6 w-6" />
                Escanear Código QR
            </Button>
            
            <Separator />
            
            {trabajosHoy.enProgreso.length > 0 && <TrabajosList titulo="🔧 En Progreso" trabajos={trabajosHoy.enProgreso} />}
            {trabajosHoy.pendientes.length > 0 && <TrabajosList titulo="📋 Trabajos Pendientes" trabajos={trabajosHoy.pendientes} />}

            {trabajosHoy.completadosHoy.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">✅ Completados Hoy ({trabajosHoy.completadosHoy.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {trabajosHoy.completadosHoy.map(trabajo => (
                            <div key={trabajo.id} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                <span className="font-medium">{trabajo.equipoSnapshot.codigoInterno}</span>
                                <span className="text-muted-foreground mx-2">-</span>
                                <span className="text-muted-foreground">{trabajo.equipoSnapshot.descripcion}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

             {totalTrabajos === 0 && trabajosHoy.completadosHoy.length === 0 && (
                <div className="text-center py-10">
                    <h3 className="text-lg font-semibold">🎉 No tienes trabajos asignados</h3>
                    <p className="text-muted-foreground mt-1">Puedes escanear equipos para crear intervenciones.</p>
                </div>
            )}
        </div>
    );
}

interface TrabajosListProps {
    titulo: string;
    trabajos: Intervencion[];
}

function TrabajosList({ titulo, trabajos }: TrabajosListProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight">{titulo}</h2>
            {trabajos.map(trabajo => (
                <TrabajoCard key={trabajo.id} trabajo={trabajo} />
            ))}
        </div>
    );
}

function TrabajoCard({ trabajo }: { trabajo: Intervencion }) {
    const enProgreso = trabajo.estado === 'en_progreso' || trabajo.estado === 'pausada';
    const equiposBasePath = trabajo.vertical === 'pest_control' ? '/fumigacion/equipos' : '/mantenimiento/equipos';

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    const fechaInicio = trabajo.fechaInicio
        ? new Date(typeof (trabajo.fechaInicio as any)?.toMillis === 'function' ? (trabajo.fechaInicio as any).toMillis() : trabajo.fechaInicio)
        : null;

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <h3 className="text-lg font-bold">{trabajo.equipoSnapshot.codigoInterno}</h3>
                    <p className="text-sm">{trabajo.equipoSnapshot.descripcion}</p>
                    <p className="text-xs text-muted-foreground">📍 {trabajo.equipoSnapshot.ubicacion}</p>
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Badge variant="outline">{trabajo.tipoIntervencion}</Badge>
                    {isClient && fechaInicio && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(fechaInicio, 'p')}
                        </Badge>
                    )}
                </div>

                <div className="mt-4">
                    {enProgreso ? (
                        <Button className="w-full" variant="secondary" asChild>
                            <Link href={`/tecnico/trabajo/${trabajo.id}/formulario`}>
                                <Wrench className="mr-2 h-4 w-4" />
                                Continuar Trabajo
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button className="flex-1" asChild>
                                <Link href={`/tecnico/trabajo/${trabajo.id}/verificar`}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Iniciar
                                </Link>
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href={`${equiposBasePath}/${trabajo.equipoId}`}>Ver Detalles</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

    
