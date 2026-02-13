'use client';

import { notFound, useRouter, useParams } from 'next/navigation';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useDoc, useFirestore, useUser, useCollection } from '@/firebase';
import { doc, collection, query, where, updateDoc, serverTimestamp, addDoc, orderBy } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, HardHat, Calendar, Shield, Activity, User, MessageSquare, Loader2, History } from 'lucide-react';
import { capitalize, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Alarma } from '@/lib/types';
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


function AlarmHistorial({ alarmId }: { alarmId: string }) {
    const db = useFirestore();
    const historialQuery = useMemo(() => {
        if (!db || !alarmId) return null;
        return query(
            collection(db, 'alarmas', alarmId, 'historial'),
            orderBy('timestamp', 'desc')
        );
    }, [db, alarmId]);
    const { data: historial, loading } = useCollection<{ accion: string; timestamp?: { seconds?: number }; userName: string; tecnicoName?: string }>(historialQuery);

    const getAccionLabel = (accion: string, entry?: { tecnicoName?: string }) => {
        switch (accion) {
            case 'asignada': return `Asignada a ${entry?.tecnicoName || 'técnico'}`;
            case 'resuelta': return 'Marcada como resuelta';
            case 'en_progreso': return 'En progreso';
            default: return capitalize(accion.replace(/_/g, ' '));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historial y Acciones
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <p className="text-sm text-muted-foreground">Cargando historial...</p>
                ) : historial && historial.length > 0 ? (
                    <ul className="space-y-3">
                        {historial.map((entry) => (
                            <li key={entry.id} className="flex items-start gap-3 text-sm">
                                <div className="rounded-full bg-muted p-1.5 mt-0.5 shrink-0">
                                    <History className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium">{getAccionLabel(entry.accion, entry)}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {entry.userName}
                                        {entry.timestamp?.seconds && (
                                            <> · {formatDate(entry.timestamp.seconds * 1000, 'PPp')}</>
                                        )}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">Aún no hay acciones registradas en el historial.</p>
                )}
            </CardContent>
        </Card>
    );
}

function AlarmActions({ alarma }: { alarma: Alarma }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | undefined>();

    const db = useFirestore();
    const { profile } = useUser();
    const techniciansQuery = useMemo(() => {
        if (!db || !profile) return null;
        return query(collection(db, 'users'), where('empresaId', '==', profile.empresaId));
    }, [db, profile]);
    const { data: users } = useCollection<User>(techniciansQuery);
    const technicians = (users || []).filter((u) => ['tecnico', 'tecnico_senior'].includes(u.role) && u.activo !== false);

    const handleCreateIntervention = () => {
        setLoading('intervention');
        router.push(`/mantenimiento/intervenciones/new?alarmId=${alarma.id}&equipoId=${alarma.equipoId}`);
    };

    const addHistorialEntry = async (accion: string, metadata?: Record<string, unknown>) => {
        if (!db || !alarma.id || !profile) return;
        const historialRef = collection(db, 'alarmas', alarma.id, 'historial');
        await addDoc(historialRef, {
            accion,
            timestamp: serverTimestamp(),
            userId: profile.id,
            userName: profile.displayName || profile.email || 'Usuario',
            ...metadata,
        });
    };

    const handleAssign = async () => {
        if (!selectedTechnicianId || !db || !alarma.id) {
            toast({ variant: "destructive", title: 'Error', description: 'Por favor, seleccione un técnico.' });
            return;
        }
        setLoading('assign');
        try {
            const technician = technicians.find(t => t.id === selectedTechnicianId);
            await updateDoc(doc(db, 'alarmas', alarma.id), {
                tecnicoAsignadoId: selectedTechnicianId,
                estado: 'en_progreso',
            });
            await addHistorialEntry('asignada', {
                tecnicoAsignadoId: selectedTechnicianId,
                tecnicoName: technician?.displayName,
            });
            toast({ title: 'Alarma Asignada', description: `La alarma ha sido asignada a ${technician?.displayName}.` });
            setDialogOpen(false);
            setSelectedTechnicianId(undefined);
        } catch (e) {
            toast({ variant: "destructive", title: 'Error', description: 'No se pudo asignar la alarma.' });
        } finally {
            setLoading(null);
        }
    };

    const handleResolve = async () => {
        if (!db || !alarma.id) return;
        setLoading('resolve');
        try {
            await updateDoc(doc(db, 'alarmas', alarma.id), {
                estado: 'resuelta',
            });
            await addHistorialEntry('resuelta');
            toast({ title: 'Alarma Resuelta', description: 'La alarma ha sido marcada como resuelta.' });
        } catch (e) {
            toast({ variant: "destructive", title: 'Error', description: 'No se pudo resolver la alarma.' });
        } finally {
            setLoading(null);
        }
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
  const db = useFirestore();
  const alarmId = Array.isArray(params.id) ? params.id[0] : params.id;
  const docRef = db && alarmId ? doc(db, 'alarmas', alarmId) : null;
  const { data: alarma, loading } = useDoc<Alarma>(docRef);

  if (loading) {
    return <div className="p-6">Cargando detalles de la alarma...</div>;
  }
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

  const equipoSnapshot = (alarma as any).equipoSnapshot;
  const fechaGeneracion = (alarma as any).fechaGeneracion;
  const fechaLimiteAtencion = (alarma as any).fechaLimiteAtencion;
  const generadoPor = (alarma as any).generadoPor;
  const mensaje = (alarma as any).mensaje;
  const numeroAlarma = (alarma as any).numeroAlarma;

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
                    <span>{numeroAlarma || alarma.id}</span>
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
                    {mensaje && (
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Mensaje</p>
                            <p className="font-medium">{mensaje}</p>
                        </div>
                    </div>
                    )}
                     {equipoSnapshot && (
                     <div className="flex items-start gap-3">
                        <HardHat className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Equipo Afectado</p>
                            <Link href={`/mantenimiento/equipos/${alarma.equipoId}`} className="font-medium text-primary hover:underline">
                                {equipoSnapshot.descripcion} ({equipoSnapshot.codigoInterno})
                            </Link>
                        </div>
                    </div>
                    )}
                    {fechaGeneracion && (
                    <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Fecha de Generación</p>
                            <p className="font-medium">{formatDate(fechaGeneracion, 'PPPPp')}</p>
                        </div>
                    </div>
                    )}
                    {fechaLimiteAtencion && (
                        <div className="flex items-start gap-3">
                            <Shield className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                            <div>
                                <p className="text-muted-foreground">Fecha Límite</p>
                                <p className="font-medium">{formatDate(fechaLimiteAtencion, 'PPPPp')}</p>
                            </div>
                        </div>
                    )}
                     {generadoPor && (
                     <div className="flex items-start gap-3">
                        <User className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Generada Por</p>
                            <p className="font-medium">{capitalize(generadoPor)}</p>
                        </div>
                    </div>
                    )}
                </CardContent>
            </Card>

            <AlarmHistorial alarmId={alarma.id} />

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
