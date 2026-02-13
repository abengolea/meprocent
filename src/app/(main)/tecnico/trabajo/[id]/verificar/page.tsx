
"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getEquipoById } from '@/lib/mock-data';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Equipo, Intervencion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, HardHat, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function VerificarEquipoPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const db = useFirestore();
    const [equipo, setEquipo] = useState<Equipo | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const intervencionId = Array.isArray(params.id) ? params.id[0] : params.id;
    const docRef = db && intervencionId ? doc(db, 'intervenciones', intervencionId) : null;
    const { data: intervencion, loading } = useDoc<Intervencion>(docRef);

    useEffect(() => {
        async function fetchEquipo() {
            if (!intervencion?.equipoId) return;
            const fetchedEquipo = await getEquipoById(intervencion.equipoId);
            if (fetchedEquipo) {
                setEquipo(fetchedEquipo);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se encontró el equipo para esta intervención."
                });
                router.back();
            }
        }
        fetchEquipo();
    }, [intervencion?.equipoId, router, toast]);

    // Simula la apertura de la cámara
    const handleScanQR = async () => {
         try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            // Aquí iría la lógica para escanear el QR desde el stream de video
            // Simulamos un escaneo exitoso
            setTimeout(() => {
                toast({ title: "QR Escaneado", description: `Equipo ${equipo?.codigoInterno} verificado correctamente.`});
                router.push(`/tecnico/trabajo/${intervencionId}/formulario`);
            }, 2500);

        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Acceso a Cámara Denegado',
                description: 'Por favor, habilita los permisos de cámara en tu navegador.',
            });
        }
    };
    
    const handleConfirmarSinEscaner = () => {
        toast({
            variant: "default",
            title: "Confirmación Manual",
            description: "Has confirmado manualmente el equipo. Procediendo al trabajo.",
        });
        router.push(`/tecnico/trabajo/${intervencionId}/formulario`);
    }

    if (loading || !intervencion || !equipo) {
        return (
             <div className="p-4 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Card>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center gap-4">
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-bold">Verificación de Equipo</h1>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                            <HardHat className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle>{equipo.codigoInterno}</CardTitle>
                            <CardDescription>{equipo.descripcion}</CardDescription>
                            <p className="text-xs text-muted-foreground mt-1">📍 {equipo.ubicacion.planta} - {equipo.ubicacion.sector}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Verificación Requerida</AlertTitle>
                <AlertDescription>
                    Para confirmar que estás frente al equipo correcto, escanea su código QR.
                </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
                <Card className="overflow-hidden">
                    <CardContent className="p-4">
                        {hasCameraPermission === null && (
                            <Button className="w-full h-32 text-lg" onClick={handleScanQR}>
                                <QrCode className="mr-4 h-8 w-8" />
                                Escanear QR del Equipo
                            </Button>
                        )}
                        {hasCameraPermission === false && (
                            <div className="text-center p-4 text-destructive">
                                <p>La cámara no está disponible. Habilita los permisos y recarga la página.</p>
                            </div>
                        )}
                         {hasCameraPermission === true && (
                            <div className="relative aspect-video bg-black rounded-md flex items-center justify-center">
                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                <div className="absolute inset-0 border-8 border-green-500/50 rounded-lg animate-pulse"></div>
                                <p className="absolute bottom-2 text-white bg-black/50 px-2 py-1 rounded-md text-sm">Apuntando al código QR...</p>
                            </div>
                         )}
                    </CardContent>
                </Card>

                <div className="relative flex items-center justify-center">
                    <Separator className="shrink" />
                    <span className="mx-4 text-xs text-muted-foreground">O</span>
                    <Separator className="shrink" />
                </div>
                 
                <Button variant="outline" className="w-full" onClick={handleConfirmarSinEscaner}>
                    Confirmar sin escanear (QR no legible)
                </Button>
            </div>
        </div>
    );
}
