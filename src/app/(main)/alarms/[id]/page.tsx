import { getAlarmById } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HardHat, FileText, Calendar, Shield, Activity, User, MessageSquare } from 'lucide-react';
import { capitalize, formatDate } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alarma = await getAlarmById(params.id);

  if (!alarma) {
    return {
      title: 'Alarma no encontrada',
    };
  }

  return {
    title: `Alarma: ${alarma.numeroAlarma} | MaintWise`,
    description: `Detalles de la alarma ${alarma.titulo}.`,
  };
}

export default async function AlarmDetailPage({ params }: Props) {
  const alarma = await getAlarmById(params.id);

  if (!alarma) {
    notFound();
  }
  
  const getSeverityVariant = (severity: string) => {
    switch(severity) {
      case 'critica': return 'destructive';
      case 'alta': return 'default';
      case 'media': return 'secondary';
      default: return 'outline';
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'pendiente': return 'destructive';
        case 'en_progreso': return 'default';
        case 'resuelta': return 'outline';
        default: return 'secondary';
    }
}

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
                <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{alarma.titulo}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{alarma.numeroAlarma}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
            <Badge variant={getSeverityVariant(alarma.severidad)} className="text-sm">
                Severidad: {capitalize(alarma.severidad)}
            </Badge>
             <Badge variant={getStatusVariant(alarma.estado)} className="text-sm">
                {capitalize(alarma.estado.replace(/_/g, ' '))}
            </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Alarma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Mensaje</p>
                            <p className="font-medium">{alarma.mensaje}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <HardHat className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Equipo Afectado</p>
                            <Link href={`/equipment/${alarma.equipoId}`} className="font-medium text-primary hover:underline">
                                {alarma.equipoSnapshot.descripcion} ({alarma.equipoSnapshot.codigoInterno})
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Fecha de Generación</p>
                            <p className="font-medium">{formatDate(alarma.fechaGeneracion, 'PPPPp')}</p>
                        </div>
                    </div>
                    {alarma.fechaLimiteAtencion && (
                        <div className="flex items-start gap-3">
                            <Shield className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-muted-foreground">Fecha Límite</p>
                                <p className="font-medium">{formatDate(alarma.fechaLimiteAtencion, 'PPPPp')}</p>
                            </div>
                        </div>
                    )}
                     <div className="flex items-start gap-3">
                        <User className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Generada Por</p>
                            <p className="font-medium">{capitalize(alarma.generadoPor)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Historial y Acciones</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">Próximamente: historial de la alarma y acciones realizadas.</p>
                </CardContent>
            </Card>

        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5"/>
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Crear Intervención</Button>
              <Button variant="secondary" className="w-full">Asignar a Técnico</Button>
              <Button variant="outline" className="w-full">Marcar como Resuelta</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
