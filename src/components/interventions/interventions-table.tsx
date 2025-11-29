
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import type { Intervencion } from "@/lib/types";
import { Card } from "@/components/ui/card";
import React, { useState, useEffect } from "react";

interface InterventionsTableProps {
    intervenciones: Intervencion[];
}

export function InterventionsTable({ intervenciones }: InterventionsTableProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedInterventions = intervenciones.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

    const getStatusVariant = (status: Intervencion['estadoCierre']) => {
        switch (status) {
            case 'abierta': return 'default';
            case 'cerrada': return 'outline';
            case 'pendiente_aprobacion': return 'secondary';
            default: return 'secondary';
        }
    }
    
    if (!isClient) {
        return null;
    }

    if (!intervenciones.length) {
        return (
            <Card>
                <div className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No hay intervenciones</h3>
                    <p className="text-muted-foreground">No se han registrado intervenciones de mantenimiento.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">N° Intervención</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Técnico</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedInterventions.map((intervencion) => (
                        <TableRow key={intervencion.id}>
                            <TableCell className="font-medium">{intervencion.numeroIntervencion}</TableCell>
                            <TableCell>{intervencion.equipoSnapshot.descripcion}</TableCell>
                            <TableCell>{capitalize(intervencion.tipoIntervencion)}</TableCell>
                            <TableCell>{intervencion.tecnicoSnapshot.displayName}</TableCell>
                            <TableCell>{formatDate(intervencion.fechaInicio)}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(intervencion.estadoCierre)}>
                                    {capitalize(intervencion.estadoCierre.replace('_', ' '))}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
