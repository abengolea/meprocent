"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Equipo } from "@/lib/types";
import QRCode from "react-qr-code";
import { QrCode as QrCodeIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface QrCodeCardProps {
    equipo: Equipo;
}

export function QrCodeCard({ equipo }: QrCodeCardProps) {
    const [qrValue, setQrValue] = useState('');

    useEffect(() => {
        // Ensure this runs only on the client
        const url = `${window.location.origin}/equipment/${equipo.id}`;
        setQrValue(url);
    }, [equipo.id]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <QrCodeIcon className="w-5 h-5"/>
                    Código QR
                </CardTitle>
                <CardDescription>Escanee para acceder rápidamente a este equipo.</CardDescription>
            </CardHeader>
            <CardContent>
                {qrValue ? (
                    <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                        <QRCode
                            value={qrValue}
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                ) : (
                    <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                )}
            </CardContent>
        </Card>
    );
}
