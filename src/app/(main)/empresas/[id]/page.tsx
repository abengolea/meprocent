
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building, HardHat, Wrench } from "lucide-react";
import {
  getEmpresaById,
  getEquiposByEmpresaId,
  getIntervencionesByEmpresaId,
} from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EquipmentTable } from "@/components/equipment/equipment-table";
import { InterventionsTable } from "@/components/interventions/interventions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const empresa = await getEmpresaById(params.id);

  if (!empresa) {
    return { title: "Empresa no encontrada" };
  }

  return {
    title: `${empresa.nombreComercial || empresa.razonSocial} | MaintWise`,
    description: `Detalles de la empresa ${empresa.nombreComercial}.`,
  };
}

export default async function EmpresaDetailPage({ params }: Props) {
  const empresa = await getEmpresaById(params.id);

  if (!empresa) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-muted rounded-lg">
          <Building className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {empresa.nombreComercial || empresa.razonSocial}
          </h1>
          <p className="text-muted-foreground">{empresa.razonSocial}</p>
        </div>
      </div>

      <Tabs defaultValue="equipos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="equipos">
            <HardHat className="mr-2 h-4 w-4" />
            Equipos
          </TabsTrigger>
          <TabsTrigger value="intervenciones">
            <Wrench className="mr-2 h-4 w-4" />
            Intervenciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value="equipos">
          <Suspense fallback={<ContentSkeleton />}>
            <EquiposTab empresaId={empresa.id} />
          </Suspense>
        </TabsContent>
        <TabsContent value="intervenciones">
          <Suspense fallback={<ContentSkeleton />}>
            <IntervencionesTab empresaId={empresa.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function EquiposTab({ empresaId }: { empresaId: string }) {
  const equipos = await getEquiposByEmpresaId(empresaId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipos en {empresaId === 'empresa-1' ? 'MaintWise Demo' : empresaId}</CardTitle>
        <CardDescription>
          Listado de todos los equipos registrados para esta empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EquipmentTable equipos={equipos} />
      </CardContent>
    </Card>
  );
}

async function IntervencionesTab({ empresaId }: { empresaId: string }) {
  const intervenciones = await getIntervencionesByEmpresaId(empresaId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Intervenciones</CardTitle>
        <CardDescription>
          Todas las intervenciones de mantenimiento realizadas para esta
          empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InterventionsTable intervenciones={intervenciones} />
      </CardContent>
    </Card>
  );
}

const ContentSkeleton = () => (
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-40" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);
