"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Equipo } from "@/lib/types";
import QRCode from "react-qr-code";
import { QrCode as QrCodeIcon, Printer } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface QrCodeCardProps {
    equipo: Equipo;
    basePath?: string;
}

export function QrCodeCard({ equipo, basePath = '/mantenimiento/equipos' }: QrCodeCardProps) {
    const [qrValue, setQrValue] = useState('');

    useEffect(() => {
        const url = `${window.location.origin}${basePath}/${equipo.id}`;
        setQrValue(url);
    }, [equipo.id, basePath]);
    
    const handlePrint = () => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir QR - ${equipo.codigoInterno}</title>
              <style>
                @media print {
                  body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    font-family: sans-serif;
                  }
                  .print-container {
                    text-align: center;
                  }
                  h2 { font-size: 24px; margin-bottom: 8px; }
                  p { font-size: 18px; margin-bottom: 16px; margin-top: 0; }
                  .qr-wrapper { padding: 16px; background: white; }
                }
              </style>
            </head>
            <body>
              <div class="print-container">
                <h2>${equipo.descripcion}</h2>
                <p>${equipo.codigoInterno}</p>
                <div class="qr-wrapper">
                  ${document.getElementById('qr-code-to-print')?.innerHTML}
                </div>
                <p style="margin-top: 16px;">${equipo.ubicacion.planta} - ${equipo.ubicacion.sector}</p>
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 250);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    };

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
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <div id="qr-code-to-print">
                      {qrValue ? (
                          <QRCode
                              value={qrValue}
                              size={256}
                              viewBox={`0 0 256 256`}
                          />
                      ) : (
                          <div className="aspect-square w-full bg-muted rounded-lg animate-pulse" />
                      )}
                    </div>
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
