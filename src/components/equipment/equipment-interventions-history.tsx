"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/utils";
import { Intervencion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface EquipmentInterventionsHistoryProps {
    intervenciones: Intervencion[];
}

export function EquipmentInterventionsHistory({ intervenciones }: EquipmentInterventionsHistoryProps) {
    const sortedInterventions = intervenciones.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
    
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
                                <TableRow key={intervencion.id}>
                                    <TableCell className="font-medium">{intervencion.numeroIntervencion}</TableCell>
                                    <TableCell>{capitalize(intervencion.tipoIntervencion)}</TableCell>
                                    <TableCell>{formatDate(intervencion.fechaInicio)}</TableCell>
                                    <TableCell>{intervencion.tecnicoSnapshot.displayName}</TableCell>
                                    <TableCell>
                                        <Badge variant={intervencion.estadoCierre === 'cerrada' ? 'secondary' : 'default'}>
                                            {capitalize(intervencion.estadoCierre.replace('_', ' '))}
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
