
import * as React from "react";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { Intervencion } from "@/lib/types";
import { PestControlDossier } from "@/components/interventions/pest-control-dossier";
import { MeprocentLogo, MeprocentText } from "@/components/logo";

const { firestore: db } = initializeFirebase();

export default async function PublicIntervencionPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { token?: string }
}) {
    if (!db) return <div>Error de conexión a la base de datos.</div>;

    const docRef = doc(db, 'intervenciones', params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        notFound();
    }

    const intervencion = { id: docSnap.id, ...docSnap.data() } as Intervencion & { id: string };

    // Verificación de seguridad básica por token
    if (!searchParams.token || searchParams.token !== intervencion.token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
                <div className="text-center space-y-4">
                    <MeprocentLogo className="mx-auto h-16 w-16" />
                    <h1 className="text-xl font-bold">Acceso Denegado</h1>
                    <p className="text-muted-foreground">El enlace de certificación no es válido o ha expirado.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 pb-12">
            <header className="bg-secondary text-white p-4 shadow-md mb-6">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <MeprocentLogo className="h-10 w-10" />
                    <MeprocentText subtext={false} />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4">
                <PestControlDossier intervencion={intervencion} />
            </main>

            <footer className="mt-12 text-center text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} MEPROCENT SOLUCIONES INDUSTRIALES SRL</p>
                <p>Documento digital auditado y certificado por sistema centralizado.</p>
            </footer>
        </div>
    );
}
