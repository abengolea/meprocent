'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { collection, query, where, documentId } from "firebase/firestore";
import { useMemo } from "react";
import type { Empresa } from "@/lib/types";

export default function EmpresasPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const empresasQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') {
      return query(collection(db, 'empresas'));
    }
    return query(
      collection(db, 'empresas'),
      where(documentId(), '==', profile.empresaId)
    );
  }, [db, profile]);
  const { data: empresas, loading } = useCollection<Empresa>(empresasQuery);

  const showNewButton = profile?.role === 'super_admin';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
            <p className="text-muted-foreground">
              Seleccione una empresa para ver sus equipos y tareas.
            </p>
        </div>
        {showNewButton && (
            <Button asChild>
                <Link href="/empresas/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nueva Empresa
                </Link>
            </Button>
        )}
      </div>
      {loading ? (
        <EmpresasSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(empresas || []).map((empresa) => (
            <Link href={`/empresas/${empresa.id}`} key={empresa.id}>
              <Card className="hover:bg-muted/50 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <Building className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle>{empresa.nombreComercial || empresa.razonSocial}</CardTitle>
                      <CardDescription>{empresa.razonSocial}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Haga clic para ver los detalles, equipos e intervenciones.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const EmpresasSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);
