
"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getIntervencionById } from "@/lib/mock-data";
import { Intervencion } from "@/lib/types";
import { PestControlDossier } from "@/components/interventions/pest-control-dossier";
import { Mountain, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicServicePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [intervencion, setIntervencion] = React.useState<Intervencion | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const token = searchParams.get('token');

    React.useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getIntervencionById(id);
            
            // In real app, check token against DB
            if (data && data.token === token) {
                setIntervencion(data);
            } else {
                setError("Acceso denegado o expediente no encontrado. Por favor verifique el enlace.");
            }
            setLoading(false);
        };
        fetch();
    }, [id, token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !intervencion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
                        <CardTitle>Error de Acceso</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground">
                        {error}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-20">
            <header className="bg-background border-b h-16 flex items-center px-6 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">MaintWise <span className="text-xs font-normal text-muted-foreground">| Certificaciones</span></span>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-4 pt-8">
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
                    Usted está visualizando el expediente como <strong>Cliente / Solicitante</strong>. 
                    Revise todas las pestañas y proceda a la firma en la sección de <strong>Firma</strong>.
                </div>
                <PestControlDossier intervencion={intervencion} isPublic={true} />
            </main>
        </div>
    );
}
