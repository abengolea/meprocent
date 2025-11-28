"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QrScannerComponent from 'react-qr-scanner';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { CameraOff } from 'lucide-react';

interface QrScannerProps {
    onScanSuccess: () => void;
}

export function QrScanner({ onScanSuccess }: QrScannerProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [error, setError] = useState<string | null>(null);

    const handleScan = (data: { text: string } | null) => {
        if (data) {
            try {
                const url = new URL(data.text);
                const path = url.pathname;
                
                // Verificamos si la ruta es de un equipo
                if (path.startsWith('/equipment/')) {
                    onScanSuccess();
                    toast({
                        title: "Equipo Detectado",
                        description: "Redirigiendo a la página del equipo...",
                    });
                    router.push(path);
                } else {
                    // Si el QR no es de un equipo, lo podríamos manejar aquí
                }
            } catch (e) {
                // El QR no contiene una URL válida, ignorar.
            }
        }
    };

    const handleError = (err: any) => {
        console.error(err);
        setError("No se pudo acceder a la cámara. Por favor, verifique los permisos en su navegador.");
    };

    if (error) {
        return (
            <Alert variant="destructive">
                <CameraOff className="h-4 w-4" />
                <AlertTitle>Error de Cámara</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="bg-black rounded-lg overflow-hidden">
            <QrScannerComponent
                delay={300}
                onError={handleError}
                onScan={handleScan}
                constraints={{
                    video: { facingMode: "environment" }
                }}
                style={{ width: '100%' }}
            />
            <div className="absolute inset-0 border-8 border-green-500/50 rounded-lg animate-pulse"></div>
            <p className="absolute bottom-2 text-white bg-black/50 px-2 py-1 rounded-md text-sm left-1/2 -translate-x-1/2">Apuntando al código QR...</p>
        </div>
    );
}
