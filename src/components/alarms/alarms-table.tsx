
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import type { Alarma } from "@/lib/types";
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface AlarmsTableProps {
    alarmas: Alarma[];
}

export function AlarmsTable({ alarmas }: AlarmsTableProps) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const toDate = (d: unknown) => (d && typeof d === 'object' && 'toMillis' in d ? (d as { toMillis: () => number }).toMillis() : d);
    const sortedAlarms = [...alarmas].sort((a, b) => {
        const da = a.fechaGeneracion || a.fecha;
        const db = b.fechaGeneracion || b.fecha;
        return new Date(toDate(db) || 0).getTime() - new Date(toDate(da) || 0).getTime();
    });

    const getSeverityVariant = (severity: Alarma['severidad']) => {
        switch (severity) {
            case 'critica': return 'destructive';
            case 'alta': return 'default';
            case 'media': return 'secondary';
            case 'baja': return 'outline';
            default: return 'secondary';
        }
    }
    
    const getStatusVariant = (status: Alarma['estado']) => {
        switch (status) {
            case 'pendiente': return 'destructive';
            case 'en_progreso': return 'default';
            case 'resuelta': return 'outline';
            default: return 'secondary';
        }
    }

    const handleRowClick = (alarmId: string) => {
        router.push(`/alarmas/${alarmId}`);
    };
    
    if (!isClient) {
        return null;
    }

    if (!alarmas.length) {
        return (
            <Card>
                <div className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No hay alarmas</h3>
                    <p className="text-muted-foreground">El sistema está funcionando sin alertas.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">N° Alarma</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Severidad</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedAlarms.map((alarma) => (
                        <TableRow 
                            key={alarma.id}
                            onClick={() => handleRowClick(alarma.id)}
                            className="cursor-pointer hover:bg-muted/50"
                        >
                            <TableCell className="font-medium">{alarma.numeroAlarma || alarma.id}</TableCell>
                            <TableCell>{alarma.titulo}</TableCell>
                            <TableCell>{alarma.equipoSnapshot?.descripcion || (alarma.equipoId ? '—' : '—')}</TableCell>
                            <TableCell>
                                <Badge variant={getSeverityVariant(alarma.severidad)}>
                                    {capitalize(alarma.severidad)}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatDate(alarma.fechaGeneracion || alarma.fecha)}</TableCell>
                             <TableCell>
                                <Badge variant={getStatusVariant(alarma.estado)}>
                                    {capitalize(alarma.estado.replace('_', ' '))}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
