"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Intervencion } from "@/lib/types";
import { SignaturePad } from "./signature-pad";
import { useFirestore, useUser } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { logIntervencionAction } from "@/lib/firestore-utils";
import { 
    ClipboardList, 
    Play, 
    FlaskConical, 
    Image as ImageIcon, 
    CheckCircle2, 
    Clock, 
    User, 
    Lock,
    Save,
    Loader2
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PestControlDossierProps {
    intervencion: Intervencion & { id: string };
    isPublic?: boolean;
}

export function PestControlDossier({ intervencion, isPublic = false }: PestControlDossierProps) {
    const { toast } = useToast();
    const db = useFirestore();
    const { profile } = useUser();
    const [activeTab, setActiveTab] = React.useState("solicitud");
    const [isSaving, setIsSaving] = React.useState(false);
    const [signature, setSignature] = React.useState<string | null>(intervencion.signature?.image || null);

    const handleSave = async () => {
        if (!db || !profile) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, 'intervenciones', intervencion.id);
            const trabajoRealizado = (document.getElementById('trabajoRealizado') as HTMLTextAreaElement)?.value || intervencion.trabajoRealizado;
            
            await updateDoc(docRef, {
                trabajoRealizado,
                updatedAt: serverTimestamp()
            });

            // Registro de Auditoría
            await logIntervencionAction(
                db, 
                intervencion.id, 
                profile.id, 
                profile.displayName, 
                'ACTUALIZACION_TRABAJO_REALIZADO',
                { length: trabajoRealizado.length }
            );

            toast({ title: "Cambios guardados", description: "El expediente ha sido actualizado en la nube." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalize = async (signerName: string, dni: string) => {
        if (!signature || !db || !profile) {
            toast({ variant: "destructive", title: "Error", description: "La firma es obligatoria." });
            return;
        }
        setIsSaving(true);
        try {
            const docRef = doc(db, 'intervenciones', intervencion.id);
            const signatureData = {
                image: signature,
                name: signerName,
                dni: dni,
                timestamp: new Date().toISOString()
            };

            await updateDoc(docRef, {
                signature: signatureData,
                locked: true,
                estado: 'cerrada',
                closedAt: serverTimestamp()
            });

            // Registro de Auditoría Crítico
            await logIntervencionAction(
                db, 
                intervencion.id, 
                profile.id, 
                profile.displayName, 
                'CERTIFICACION_FINAL_CLIENTE',
                { signerName, dni }
            );

            toast({ title: "Expediente Certificado", description: "El documento ha sido bloqueado y sellado legalmente." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "Error al certificar el documento." });
        } finally {
            setIsSaving(false);
        }
    };

    const disabled = intervencion.locked || (isPublic && activeTab !== 'conformidad');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {intervencion.numeroIntervencion}
                        {intervencion.locked && <Badge variant="secondary" className="ml-2"><Lock className="w-3 h-3 mr-1"/> Certificado</Badge>}
                    </h2>
                    <p className="text-muted-foreground">Expediente de Servicio de {intervencion.vertical === 'pest_control' ? 'Control de Plagas' : 'Mantenimiento'}</p>
                </div>
                {!intervencion.locked && !isPublic && (
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Guardar Progreso
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 w-full h-auto">
                    <TabsTrigger value="solicitud" className="flex flex-col py-2 gap-1">
                        <ClipboardList className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Solicitud</span>
                    </TabsTrigger>
                    <TabsTrigger value="ejecucion" className="flex flex-col py-2 gap-1">
                        <Play className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Ejecución</span>
                    </TabsTrigger>
                    <TabsTrigger value="quimicos" className="flex flex-col py-2 gap-1">
                        <FlaskConical className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Insumos</span>
                    </TabsTrigger>
                    <TabsTrigger value="evidencia" className="flex flex-col py-2 gap-1">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Evidencia</span>
                    </TabsTrigger>
                    <TabsTrigger value="conformidad" className="flex flex-col py-2 gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Certificar</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Aviso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="font-bold">N° Aviso</p><p>{intervencion.numeroAviso || 'N/A'}</p></div>
                                <div><p className="font-bold">Solicitante</p><p>{intervencion.solicitante || 'N/A'}</p></div>
                            </div>
                            <div><p className="font-bold">Problema Reportado</p><p className="bg-muted p-3 rounded-md">{intervencion.descripcionProblema || 'No especificado'}</p></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ejecucion">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ejecución Técnica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Técnico Interviniente</label>
                                <Input value={intervencion.tecnicoSnapshot.displayName} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Procedimiento Realizado</label>
                                <Textarea id="trabajoRealizado" defaultValue={intervencion.trabajoRealizado} disabled={disabled} rows={8} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quimicos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Control de Insumos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="p-2 text-left">Código</th>
                                            <th className="p-2 text-left">Nombre</th>
                                            <th className="p-2 text-left">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {intervencion.consumptions?.length ? intervencion.consumptions.map((c, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2 font-mono text-primary font-bold">{c.internalCode}</td>
                                                <td className="p-2">{c.name}</td>
                                                <td className="p-2">{c.qty} {c.unit}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No hay insumos registrados.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evidencia">
                    <Card><CardContent className="py-12 text-center text-muted-foreground">Módulo de fotos próximamente.</CardContent></Card>
                </TabsContent>

                <TabsContent value="conformidad">
                    <Card>
                        <CardHeader>
                            <CardTitle>Certificación de Conformidad</CardTitle>
                            <CardDescription>La firma bloquea este documento permanentemente para auditoría.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Responsable</label>
                                    <Input id="signerName" placeholder="Nombre completo" disabled={intervencion.locked} defaultValue={intervencion.signature?.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">DNI / Documento</label>
                                    <Input id="signerDni" placeholder="N° de documento" disabled={intervencion.locked} defaultValue={intervencion.signature?.dni} />
                                </div>
                            </div>
                            
                            {intervencion.locked ? (
                                <div className="border rounded-md p-6 bg-green-50/50 flex flex-col items-center border-green-200">
                                    <img src={signature || ""} alt="Firma" className="max-h-32 mb-4" />
                                    <div className="text-center text-xs text-green-700">
                                        <p className="font-bold">DOCUMENTO CERTIFICADO POR EL CLIENTE</p>
                                        <p>Fecha: {intervencion.closedAt ? formatDate(intervencion.closedAt as any, 'PPPPp') : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                                    <Button 
                                        className="w-full h-14 text-lg font-bold shadow-lg" 
                                        disabled={!signature || isSaving}
                                        onClick={() => {
                                            const name = (document.getElementById('signerName') as HTMLInputElement).value;
                                            const dni = (document.getElementById('signerDni') as HTMLInputElement).value;
                                            handleFinalize(name, dni);
                                        }}
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-6 h-6 mr-2" />}
                                        CERTIFICAR Y FINALIZAR
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
