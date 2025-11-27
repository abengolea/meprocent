import type { Metadata } from "next";
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/components/users/users-table';
import { mockUsers } from '@/lib/mock-data';
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/lib/types";

export const metadata: Metadata = {
  title: "Usuarios | MaintWise",
  description: "Gestión de usuarios del sistema.",
};

type UsersPageProps = {
  searchParams?: {
    role?: User['role'];
  };
};

export default function UsersPage({ searchParams }: UsersPageProps) {
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
          <Link href="/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersLoader role={searchParams?.role} />
      </Suspense>
    </div>
  );
}

async function UsersLoader({ role }: { role?: User['role'] }) {
    // In a real app, you would fetch users from your database
    let users = mockUsers;
    if (role) {
        users = users.filter(u => u.role === role);
    }
    return <UsersTable users={users} />;
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
