
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { QrCode, Play, AlertTriangle, Wrench, CheckCircle, Clock } from 'lucide-react';
import type { User, Intervencion, EstadoIntervencion } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { isToday, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardTecnicoProps {
    user: User;
    intervenciones: Intervencion[];
}

interface TrabajosClasificados {
    urgentes: Intervencion[];
    pendientes: Intervencion[];
    enProgreso: Intervencion[];
    completadosHoy: Intervencion[];
}

export function DashboardTecnico({ user, intervenciones }: DashboardTecnicoProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Actualiza cada minuto
        return () => clearInterval(timer);
    }, []);

    const trabajosHoy = useMemo((): TrabajosClasificados => {
        const hoy = new Date();
        // Filtramos solo las intervenciones asignadas a este técnico y que son para "hoy" o están activas.
        const misIntervenciones = intervenciones.filter(t => 
            t.tecnicoId === user.id &&
            (
                (t.tiempos.programado && isToday(new Date(t.tiempos.programado as Date))) ||
                ['asignada', 'en_progreso', 'pausada', 'requiere_repuesto'].includes(t.estado) ||
                (t.tiempos.finalizado && isToday(new Date(t.tiempos.finalizado as Date)))
            )
        );

        return {
            urgentes: misIntervenciones.filter(t => (t.prioridad === 'urgente' || t.prioridad === 'emergencia') && t.estado === 'asignada'),
            pendientes: misIntervenciones.filter(t => t.prioridad !== 'urgente' && t.prioridad !== 'emergencia' && t.estado === 'asignada'),
            enProgreso: misIntervenciones.filter(t => t.estado === 'en_progreso' || t.estado === 'pausada'),
            completadosHoy: misIntervenciones.filter(t => (t.estado === 'aprobada' || t.estado === 'cerrada' || t.estado === 'completada_tecnico') && t.tiempos.finalizado && isToday(new Date(t.tiempos.finalizado as Date)))
        };
    }, [intervenciones, user.id]);

    const totalTrabajos = trabajosHoy.urgentes.length + trabajosHoy.pendientes.length + trabajosHoy.enProgreso.length;

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
                    <CardTitle className="text-base">📋 Mis Trabajos Hoy ({totalTrabajos})</CardTitle>
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
                    <div>
                        <p className="text-2xl font-bold text-red-600">{trabajosHoy.urgentes.length}</p>
                        <p className="text-xs text-muted-foreground">Urgentes</p>
                    </div>
                </CardContent>
            </Card>

            <Button size="lg" className="h-16 text-lg font-bold">
                <QrCode className="mr-4 h-6 w-6" />
                Escanear Código QR
            </Button>
            
            <Separator />
            
            {trabajosHoy.urgentes.length > 0 && <TrabajosList titulo="🚨 Urgente - Atención Inmediata" trabajos={trabajosHoy.urgentes} />}
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
                                <span className="ml-auto text-xs text-muted-foreground">{trabajo.tiempos.duracionReal} min</span>
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
    const esUrgente = trabajo.prioridad === 'urgente' || trabajo.prioridad === 'emergencia';
    const enProgreso = trabajo.estado === 'en_progreso' || trabajo.estado === 'pausada';
    
    const getPrioridadVariant = (prioridad: Intervencion['prioridad']): "default" | "destructive" | "secondary" | "outline" => {
        switch(prioridad) {
            case 'emergencia': return 'destructive';
            case 'urgente': return 'destructive';
            case 'alta': return 'default';
            default: return 'secondary';
        }
    }

    return (
        <Card className={esUrgente && trabajo.estado === 'asignada' ? "border-2 border-destructive" : ""}>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">{trabajo.clienteSnapshot.nombreComercial}</p>
                    <h3 className="text-lg font-bold">{trabajo.equipoSnapshot.codigoInterno}</h3>
                    <p className="text-sm">{trabajo.equipoSnapshot.descripcion}</p>
                    <p className="text-xs text-muted-foreground">📍 {trabajo.equipoSnapshot.ubicacion}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline">{trabajo.tipoIntervencion}</Badge>
                    <Badge variant={getPrioridadVariant(trabajo.prioridad)}>{trabajo.prioridad}</Badge>
                     {trabajo.tiempos.programado && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3"/>
                            {formatDate(new Date(trabajo.tiempos.programado as Date), 'p')}
                        </Badge>
                    )}
                </div>

                {esUrgente && trabajo.estado === 'asignada' && (
                     <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4"/>
                        <AlertTitle>Atención Inmediata</AlertTitle>
                        <AlertDescription className="text-xs">
                            Asignado hace {formatDistanceToNow(new Date(trabajo.tiempos.asignado as Date), { locale: es, addSuffix: true })}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mt-4">
                    {enProgreso ? (
                         <Button className="w-full" variant="secondary" asChild>
                            <Link href={`/tecnico/trabajo/${trabajo.id}/formulario`}>
                                <Wrench className="mr-2 h-4 w-4"/>
                                Continuar Trabajo
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                             <Button className="flex-1" variant={esUrgente ? "destructive" : "default"} asChild>
                                <Link href={`/tecnico/trabajo/${trabajo.equipoId}/verificar`}>
                                    <Play className="mr-2 h-4 w-4"/>
                                    Iniciar
                                </Link>
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href={`/equipment/${trabajo.equipoId}`}>
                                    Ver Detalles
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
