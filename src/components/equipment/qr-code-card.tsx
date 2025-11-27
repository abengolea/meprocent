"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Equipo } from "@/lib/types";
import QRCode from "react-qr-code";
import { QrCode as QrCodeIcon, Printer } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

interface QrCodeCardProps {
    equipo: Equipo;
}

const PrintableQrCode = React.forwardRef<HTMLDivElement, { qrValue: string; equipo: Equipo }>(({ qrValue, equipo }, ref) => {
    return (
        <div ref={ref} className="p-4 bg-white text-black flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2">{equipo.descripcion}</h2>
            <p className="text-sm mb-4">{equipo.codigoInterno}</p>
            <QRCode
                value={qrValue}
                size={256}
                viewBox={`0 0 256 256`}
            />
        </div>
    )
});
PrintableQrCode.displayName = 'PrintableQrCode';

export function QrCodeCard({ equipo }: QrCodeCardProps) {
    const [qrValue, setQrValue] = useState('');
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ensure this runs only on the client
        const url = `${window.location.origin}/equipment/${equipo.id}`;
        setQrValue(url);
    }, [equipo.id]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `QR-Code-${equipo.codigoInterno}`,
    });

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
                <div style={{ display: 'none' }}>
                    <PrintableQrCode ref={printRef} qrValue={qrValue} equipo={equipo} />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handlePrint} className="w-full" disabled={!qrValue}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir QR
                </Button>
            </CardFooter>
        </Card>
    );
}
