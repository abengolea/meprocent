
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalize, formatDate } from "@/lib/utils";
import type { Equipo } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";

interface EquipmentTableProps {
    equipos: Equipo[];
    basePath?: string;
}

export function EquipmentTable({ equipos, basePath = '/equipos' }: EquipmentTableProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const getStatusVariant = (status: Equipo['estadoActual']) => {
        switch (status) {
            case 'operativo': return 'default';
            case 'fuera_de_servicio': return 'destructive';
            default: return 'secondary';
        }
    }
    
    if (!isClient) {
        return null; // O un esqueleto de carga si lo prefieres
    }

    if (!equipos.length) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No se encontraron equipos</h3>
                    <p className="text-muted-foreground">Cree su primer equipo para comenzar.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Código</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Próx. Mant.</TableHead>
                        <TableHead className="w-[50px] text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipos.map((equipo) => (
                        <TableRow key={equipo.id}>
                            <TableCell className="font-medium">{equipo.codigoInterno}</TableCell>
                            <TableCell>{equipo.descripcion}</TableCell>
                            <TableCell>{capitalize(equipo.tipoEquipo.replace('_', ' '))}</TableCell>
                            <TableCell>{equipo.ubicacion?.planta ?? 'N/A'} - {equipo.ubicacion?.sector ?? 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(equipo.estadoActual)}>
                                    {capitalize(equipo.estadoActual.replace(/_/g, ' '))}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {equipo.proximoMantenimiento ? formatDate(equipo.proximoMantenimiento.fechaProgramada) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`${basePath}/${equipo.id}`}>
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Ver detalles</span>
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
