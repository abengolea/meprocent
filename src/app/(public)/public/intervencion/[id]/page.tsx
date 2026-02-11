
"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Intervencion } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MeprocentLogo, MeprocentText } from '@/components/logo';
import { PestControlDossier } from '@/components/interventions/pest-control-dossier';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

const { firestore: db } = initializeFirebase();

export default function PublicInterventionPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [intervencion, setIntervencion] = useState<Intervencion & { id: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = searchParams.get('token');
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        if (!db || !id) return;

        const docRef = doc(db, 'intervenciones', id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as Intervencion;
                // Validación básica de token en cliente
                if (data.token === token) {
                    setIntervencion({ id: docSnap.id, ...data });
                    setError(null);
                } else {
                    setError('El token de acceso es inválido o ha expirado.');
                }
            } else {
                setError('La intervención solicitada no existe.');
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError('No tienes permiso para acceder a este recurso.');
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/30 p-4 space-y-6">
                <header className="flex items-center justify-center gap-4 py-8">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </header>
                <div className="max-w-4xl mx-auto space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Acceso Denegado</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <header className="bg-secondary text-white py-6 shadow-lg mb-8">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MeprocentLogo className="h-10 w-10" />
                        <MeprocentText subtext={false} />
                    </div>
                    <div className="text-right text-xs opacity-70 hidden sm:block">
                        <p>CERTIFICACIÓN TÉCNICA</p>
                        <p>EXP: {intervencion?.numeroIntervencion}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4">
                <PestControlDossier intervencion={intervencion!} />
            </main>
            
            <footer className="mt-12 py-8 text-center text-muted-foreground text-xs">
                <p>© {new Date().getFullYear()} MEPROCENT SOLUCIONES INDUSTRIALES SRL</p>
                <p>Sistema de Gestión de Servicios Certificados</p>
            </footer>
        </div>
    );
}
