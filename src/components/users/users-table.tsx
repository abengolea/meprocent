"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import type { User } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    
    const getStatusVariant = (active: boolean) => {
        return active ? 'default' : 'secondary';
    }

    if (!users.length) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No se encontraron usuarios</h3>
                    <p className="text-muted-foreground">Cree su primer usuario para comenzar.</p>
                </CardContent>
            </Card>
        )
    }
    
    const getRoleName = (role: User['role']) => {
        const roleMap = {
            super_admin: 'Super Admin',
            admin: 'Administrador',
            supervisor: 'Supervisor',
            tecnico_senior: 'Técnico Senior',
            tecnico: 'Técnico',
        };
        return roleMap[role] || capitalize(role);
    }

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-[50px] text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.displayName}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleName(user.role)}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(user.activo)}>
                                    {user.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Abrir menú</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem>Ver Actividad</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            Desactivar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
