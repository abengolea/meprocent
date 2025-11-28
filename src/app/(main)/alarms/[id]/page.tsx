
'use client';

import { getAlarmById, mockUsers } from '@/lib/mock-data';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HardHat, FileText, Calendar, Shield, Activity, User, MessageSquare, Loader2 } from 'lucide-react';
import { capitalize, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Alarma, User as UserType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";


// Metadata generation should be a separate export if we use 'use client' at the top level.
// However, since we are fetching data inside the component now, we can't generate static metadata easily.
// For this prototype, we'll remove generateMetadata for simplicity as we make the page dynamic.

function AlarmActions({ alarma }: { alarma: Alarma }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | undefined>();

    const technicians = mockUsers.filter(u => u.role === 'tecnico' || u.role === 'tecnico_senior');

    const handleCreateIntervention = () => {
        setLoading('intervention');
        // In a real app, you might create a preliminary intervention record here.
        router.push(`/interventions/new?alarmId=${alarma.id}&equipoId=${alarma.equipoId}`);
    };

    const handleAssign = () => {
        if (!selectedTechnicianId) {
            toast({
                variant: "destructive",
                title: 'Error',
                description: 'Por favor, seleccione un técnico.',
            });
            return;
        }
        setLoading('assign');
        setTimeout(() => {
            const technician = technicians.find(t => t.id === selectedTechnicianId);
            toast({
                title: 'Alarma Asignada',
                description: `La alarma ha sido asignada a ${technician?.displayName}.`,
            });
            setLoading(null);
            setDialogOpen(false);
            setSelectedTechnicianId(undefined);
            // Here you would update the alarm in the database
        }, 1000);
    };

    const handleResolve = () => {
        setLoading('resolve');
        setTimeout(() => {
            toast({
                title: 'Alarma Resuelta',
                description: 'La alarma ha sido marcada como resuelta.',
            });
            // Here you would also update the alarm state in the database
            setLoading(null);
            router.refresh(); // Refresh data on the page
        }, 1000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Acciones Rápidas
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Button className="w-full" onClick={handleCreateIntervention} disabled={!!loading}>
                    {loading === 'intervention' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Crear Intervención
                </Button>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary" className="w-full" disabled={!!loading}>
                            Asignar a Técnico
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Asignar Alarma a Técnico</DialogTitle>
                            <DialogDescription>
                                Seleccione el técnico que se hará cargo de esta alarma.
                            </DialogDescription>
                        </DialogHeader>
                        <RadioGroup 
                            value={selectedTechnicianId} 
                            onValueChange={setSelectedTechnicianId}
                            className="space-y-2 my-4"
                        >
                            {technicians.map(tech => (
                                <div key={tech.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={tech.id} id={`tech-${tech.id}`} />
                                    <Label htmlFor={`tech-${tech.id}`} className="flex-1 cursor-pointer">{tech.displayName}</Label>
                                    <Badge variant="outline">{capitalize(tech.role.replace('tecnico_', ''))}</Badge>
                                </div>
                            ))}
                        </RadioGroup>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={!!loading}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAssign} disabled={!selectedTechnicianId || !!loading}>
                                {loading === 'assign' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Confirmar Asignación
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full" onClick={handleResolve} disabled={!!loading}>
                    {loading === 'resolve' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Marcar como Resuelta
                </Button>
            </CardContent>
        </Card>
    );
}


export default function AlarmDetailPage() {
  const params = useParams();
  const [alarma, setAlarma] = useState<Alarma | null>(null);
  const [loading, setLoading] = useState(true);
  const alarmId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (alarmId) {
      const fetchAlarm = async () => {
          setLoading(true);
          const fetchedAlarm = await getAlarmById(alarmId);
          if (fetchedAlarm) {
              setAlarma(fetchedAlarm);
          } else {
              notFound();
          }
          setLoading(false);
      };
      fetchAlarm();
    }
  }, [alarmId]);


  if (loading || !alarma) {
    return <div className="p-6">Cargando detalles de la alarma...</div>;
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
            <Suspense fallback={<div>Cargando acciones...</div>}>
              <AlarmActions alarma={alarma} />
            </Suspense>
        </div>
      </div>
    </div>
  );
}

    