"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import type { Alarma } from "@/lib/types";
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from "react";

interface AlarmsTableProps {
    alarmas: Alarma[];
}

export function AlarmsTable({ alarmas }: AlarmsTableProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedAlarms = alarmas.sort((a, b) => new Date(b.fechaGeneracion).getTime() - new Date(a.fechaGeneracion).getTime());

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
                        <TableRow key={alarma.id}>
                            <TableCell className="font-medium">{alarma.numeroAlarma}</TableCell>
                            <TableCell>{alarma.titulo}</TableCell>
                            <TableCell>{alarma.equipoSnapshot.descripcion}</TableCell>
                            <TableCell>
                                <Badge variant={getSeverityVariant(alarma.severidad)}>
                                    {capitalize(alarma.severidad)}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatDate(alarma.fechaGeneracion)}</TableCell>
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
