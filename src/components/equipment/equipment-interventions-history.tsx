"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import { Intervencion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EquipmentInterventionsHistoryProps {
    intervenciones: Intervencion[];
    basePath?: string;
}

export function EquipmentInterventionsHistory({ intervenciones, basePath = '/mantenimiento/intervenciones' }: EquipmentInterventionsHistoryProps) {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const sortedInterventions = [...intervenciones].sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

    if (!isClient) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5"/> Historial de Intervenciones</CardTitle>
                <CardDescription>Registro de todos los mantenimientos realizados en este equipo.</CardDescription>
            </CardHeader>
            <CardContent>
                {sortedInterventions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>N°</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Técnico</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedInterventions.map((intervencion) => (
                                <TableRow
                                    key={intervencion.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => intervencion.id && router.push(`${basePath}/${intervencion.id}`)}
                                >
                                    <TableCell className="font-medium text-primary hover:underline">{intervencion.numeroIntervencion}</TableCell>
                                    <TableCell>{capitalize(intervencion.tipoIntervencion)}</TableCell>
                                    <TableCell>{formatDate(intervencion.fechaInicio)}</TableCell>
                                    <TableCell>{intervencion.tecnicoSnapshot.displayName}</TableCell>
                                    <TableCell>
                                        <Badge variant={intervencion.estado === 'cerrada' ? 'secondary' : 'default'}>
                                            {capitalize((intervencion.estado || 'en_progreso').replace(/_/g, ' '))}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No hay intervenciones registradas para este equipo.</p>
                )}
            </CardContent>
        </Card>
    );
}
