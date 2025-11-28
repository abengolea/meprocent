import { getEquipoById, getIntervencionesByEquipoId, getPlanes } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { HardHat, Bot, FileText, ChevronRight, Pencil } from 'lucide-react';
import { capitalize } from '@/lib/utils';
import { QrCodeCard } from '@/components/equipment/qr-code-card';
import { EquipmentDetailsCard } from '@/components/equipment/equipment-details-card';
import { EquipmentInterventionsHistory } from '@/components/equipment/equipment-interventions-history';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const equipo = await getEquipoById(params.id);

  if (!equipo) {
    return {
      title: 'Equipo no encontrado',
    };
  }

  return {
    title: `${equipo.codigoInterno} - ${equipo.descripcion} | MaintWise`,
    description: `Detalles del equipo ${equipo.descripcion}.`,
  };
}

export default async function EquipmentDetailPage({ params }: Props) {
  const equipo = await getEquipoById(params.id);

  if (!equipo) {
    notFound();
  }
  
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'operativo': return 'default';
      case 'fuera_de_servicio': return 'destructive';
      default: return 'secondary';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
                <HardHat className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{equipo.descripcion}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{equipo.codigoInterno}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{capitalize(equipo.tipoEquipo.replace('_', ' '))}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
            <Badge variant={getStatusVariant(equipo.estadoActual)} className="text-sm">
                {capitalize(equipo.estadoActual.replace(/_/g, ' '))}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href={`/equipment/${equipo.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EquipmentDetailsCard equipo={equipo} />
          
          <Suspense fallback={<Card><CardContent><p>Cargando historial...</p></CardContent></Card>}>
            <InterventionsHistoryLoader equipoId={equipo.id} />
          </Suspense>

        </div>
        <div className="space-y-6">
          <QrCodeCard equipo={equipo} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5"/>
                Análisis Predictivo IA
              </CardTitle>
              <CardDescription>Use IA para predecir fallas y optimizar el mantenimiento.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analice los datos históricos de este equipo para obtener recomendaciones inteligentes.
              </p>
              <Button asChild className="w-full">
                <Link href={`/equipment/${equipo.id}/analysis`}>
                  Iniciar Análisis con IA
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Suspense fallback={<Card><CardContent><p>Cargando planes...</p></CardContent></Card>}>
            <AssociatedPlansLoader planIds={equipo.planesAsociados} />
          </Suspense>

        </div>
      </div>
    </div>
  );
}

async function InterventionsHistoryLoader({ equipoId }: { equipoId: string }) {
  const intervenciones = await getIntervencionesByEquipoId(equipoId);
  return <EquipmentInterventionsHistory intervenciones={intervenciones} />;
}

async function AssociatedPlansLoader({ planIds }: { planIds: string[] }) {
    const todosLosPlanes = await getPlanes();
    const planesAsociados = todosLosPlanes.filter(p => planIds.includes(p.id));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5"/>
                    Planes de Mantenimiento
                </CardTitle>
                <CardDescription>Planes asociados a este equipo.</CardDescription>
            </CardHeader>
            <CardContent>
                {planesAsociados.length > 0 ? (
                    <ul className="space-y-3">
                        {planesAsociados.map(plan => (
                            <li key={plan.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                               <FileText className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="font-medium">{plan.nombrePlan}</p>
                                    <p className="text-sm text-muted-foreground">Frecuencia: cada {plan.frecuencia.valor} {plan.frecuencia.tipo}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No hay planes de mantenimiento asociados.</p>
                )}
            </CardContent>
        </Card>
    );
}
