'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Insumo } from '@/lib/types';
import Link from 'next/link';
import { MoreHorizontal, Pencil, ExternalLink } from 'lucide-react';

interface InsumosTableProps {
  insumos: Insumo[];
}

const typeLabels: Record<string, string> = {
  chemical: 'Químico',
  material: 'Material',
  spare_part: 'Repuesto',
};

export function InsumosTable({ insumos }: InsumosTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Ingrediente activo</TableHead>
            <TableHead>Registro</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insumos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                No hay insumos en el catálogo. Agregue productos químicos o materiales para usarlos en intervenciones.
              </TableCell>
            </TableRow>
          ) : (
            insumos.map((insumo) => (
              <TableRow key={insumo.id}>
                <TableCell className="font-mono font-medium">{insumo.internalCode}</TableCell>
                <TableCell>{insumo.name}</TableCell>
                <TableCell>
                  <Badge variant={insumo.type === 'chemical' ? 'default' : 'secondary'}>
                    {typeLabels[insumo.type] || insumo.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{insumo.activeIngredient || '-'}</TableCell>
                <TableCell className="text-sm">{insumo.registration || '-'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/insumos/${insumo.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      {insumo.msdsUrl && (
                        <DropdownMenuItem asChild>
                          <a href={insumo.msdsUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ficha MSDS
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
