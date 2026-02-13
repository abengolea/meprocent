'use client';

import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/users/users-table';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";

export default function UsersPage({ searchParams }: { searchParams?: { role?: User['role'] } }) {
  const { profile } = useUser();
  const db = useFirestore();

  const usersQuery = useMemo(() => {
    if (!db || !profile) return null;
    let q = query(collection(db, "users"), where("empresaId", "==", profile.empresaId));
    if (searchParams?.role) {
      q = query(q, where("role", "==", searchParams.role));
    }
    return q;
  }, [db, profile, searchParams?.role]);

  const { data: users, loading } = useCollection<User>(usersQuery);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Cree, edite y gestione los roles y permisos de los usuarios de su empresa.
          </p>
        </div>
        <Button asChild>
          <Link href="/usuarios/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      {loading ? (
        <UsersTableSkeleton />
      ) : (
        <UsersTable users={users || []} />
      )}
    </div>
  );
}

const UsersTableSkeleton = () => (
    <div className="rounded-lg border">
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
                {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)
