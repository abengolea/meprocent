
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Intervencion, Insumo } from "@/lib/types";
import { useFirestore, useUser } from "@/firebase";
import { doc, updateDoc, serverTimestamp, collection, getDocs, query, where } from "firebase/firestore";
import { writeAuditLog } from "@/lib/audit";
import { 
    ClipboardList, 
    Play, 
    FlaskConical, 
    ImageIcon, 
    CheckCircle2, 
    User, 
    Lock,
    Save,
    Loader2,
    Plus,
    Download,
    ExternalLink
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PestControlDossierProps {
    intervencion: Intervencion & { id: string };
}

export function PestControlDossier({ intervencion }: PestControlDossierProps) {
    const { toast } = useToast();
    const db = useFirestore();
    const { profile } = useUser();
    
    const [activeTab, setActiveTab] = React.useState("solicitud");
    const [isSaving, setIsSaving] = React.useState(false);
    const [insumos, setInsumos] = React.useState<Insumo[]>([]);

    const isLocked = intervencion.locked === true;

    React.useEffect(() => {
        async function fetchInsumos() {
            if (!db) return;
            const q = query(collection(db, 'insumos'), where('type', '==', 'chemical'));
            const snap = await getDocs(q);
            setInsumos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Insumo)));
        }
        fetchInsumos();
    }, [db]);

    const handleSave = async () => {
        if (!db || !profile || isLocked) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, 'intervenciones', intervencion.id);
            const trabajoRealizado = (document.getElementById('trabajoRealizado') as HTMLTextAreaElement)?.value;
            
            await updateDoc(docRef, {
                trabajoRealizado,
                updatedAt: serverTimestamp()
            });

            await writeAuditLog({
                db,
                interventionId: intervencion.id,
                action: "UPDATED",
                userId: profile.id,
                userName: profile.displayName,
                payload: { field: 'trabajoRealizado' }
            });

            toast({ title: "Cambios guardados", description: "El expediente ha sido actualizado." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {intervencion.numeroIntervencion}
                        {isLocked && <Badge variant="secondary" className="ml-2"><Lock className="w-3 h-3 mr-1"/> Expediente Bloqueado</Badge>}
                    </h2>
                    <p className="text-muted-foreground">Servicio de Control de Plagas Certificado</p>
                </div>
                <div className="flex gap-2">
                    {isLocked && (
                        <Button variant="outline" asChild>
                            <a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">
                                <Download className="w-4 h-4 mr-2" />
                                Descargar PDF
                            </a>
                        </Button>
                    )}
                    {!isLocked ? (
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Avance
                        </Button>
                    ) : (
                        <Button variant="ghost" disabled>
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            Documento Cerrado
                        </Button>
                    )}
                </div>
            </div>

            {!isLocked && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-medium">Link de Certificación para el Cliente</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                            const url = `${window.location.origin}/p/${intervencion.id}?token=${intervencion.token}`;
                            navigator.clipboard.writeText(url);
                            toast({ title: "Link copiado", description: "Envía este link al cliente para que firme." });
                        }}>
                            Copiar URL Pública
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 w-full h-auto">
                    <TabsTrigger value="solicitud" className="flex flex-col py-2 gap-1"><ClipboardList className="w-4 h-4" /><span className="text-[10px] md:text-xs">Solicitud</span></TabsTrigger>
                    <TabsTrigger value="ejecucion" className="flex flex-col py-2 gap-1"><Play className="w-4 h-4" /><span className="text-[10px] md:text-xs">Ejecución</span></TabsTrigger>
                    <TabsTrigger value="quimicos" className="flex flex-col py-2 gap-1"><FlaskConical className="w-4 h-4" /><span className="text-[10px] md:text-xs">Químicos</span></TabsTrigger>
                    <TabsTrigger value="evidencia" className="flex flex-col py-2 gap-1"><ImageIcon className="w-4 h-4" /><span className="text-[10px] md:text-xs">Evidencia</span></TabsTrigger>
                    <TabsTrigger value="conformidad" className="flex flex-col py-2 gap-1"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] md:text-xs">Firma</span></TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud">
                    <Card>
                        <CardHeader><CardTitle>Datos de la Solicitud</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="font-bold">Solicitante</p><p>{intervencion.solicitante || 'N/A'}</p></div>
                                <div><p className="font-bold">Aviso N°</p><p>{intervencion.numeroAviso || 'Manual'}</p></div>
                            </div>
                            <div><p className="font-bold">Descripción del Problema</p><p className="bg-muted p-3 rounded-md italic">{intervencion.descripcionProblema || 'Sin descripción previa'}</p></div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ejecucion">
                    <Card>
                        <CardHeader><CardTitle>Ejecución Técnica</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Técnico Responsable</label>
                                <Input value={intervencion.tecnicoSnapshot.displayName} disabled />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripción del Procedimiento</label>
                                <Textarea id="trabajoRealizado" defaultValue={intervencion.trabajoRealizado} disabled={isLocked} rows={8} placeholder="Describa las tareas realizadas..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quimicos">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Control de Insumos</CardTitle>
                                <CardDescription>Uso obligatorio de códigos internos (M01, M02...)</CardDescription>
                            </div>
                            {!isLocked && <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/> Agregar</Button>}
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted font-bold">
                                        <tr>
                                            <th className="p-2">Código</th>
                                            <th className="p-2">Producto</th>
                                            <th className="p-2 text-right">Cant.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {intervencion.consumptions?.length ? intervencion.consumptions.map((c, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2 font-mono text-primary font-bold">{c.internalCode}</td>
                                                <td className="p-2">{c.name}</td>
                                                <td className="p-2 text-right">{c.qty} {c.unit}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={3} className="p-8 text-center text-muted-foreground italic">Seleccione químicos del catálogo para registrar consumos.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {!isLocked && (
                                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                                    <p className="text-xs font-bold uppercase mb-2">Selector de Catálogo</p>
                                    <Select>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar químico por código..." /></SelectTrigger>
                                        <SelectContent>
                                            {insumos.map(i => (
                                                <SelectItem key={i.id} value={i.id}>{i.internalCode} - {i.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evidencia">
                    <Card><CardContent className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <ImageIcon className="w-12 h-12 opacity-20" />
                        <p>Las fotos de evidencia se almacenarán bajo reglas de Storage restringidas.</p>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="conformidad">
                    <Card>
                        <CardHeader>
                            <CardTitle>Certificación Digital</CardTitle>
                            <CardDescription>La firma sella el documento. No podrá ser editado posteriormente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Responsable</label>
                                    <Input id="signerName" disabled={isLocked} defaultValue={intervencion.signature?.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">DNI / Documento</label>
                                    <Input id="signerDni" disabled={isLocked} defaultValue={intervencion.signature?.dni} />
                                </div>
                            </div>
                            
                            {isLocked ? (
                                <div className="border rounded-md p-6 bg-green-50/50 flex flex-col items-center border-green-200">
                                    {intervencion.signature?.image && <img src={intervencion.signature.image} alt="Firma" className="max-h-32 mb-4" />}
                                    <div className="text-center text-xs text-green-700">
                                        <p className="font-bold uppercase tracking-widest">Documento Certificado Digitalmente</p>
                                        <p>Finalizado el {intervencion.closedAt ? formatDate(intervencion.closedAt as any, 'PPPPp') : 'N/A'}</p>
                                    </div>
                                    <Button variant="outline" className="mt-6" asChild>
                                        <a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">
                                            <Download className="w-4 h-4 mr-2" />
                                            Descargar Reporte PDF
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-muted-foreground">La firma del cliente debe realizarse desde el portal público.</p>
                                    <Button variant="outline" className="mt-4" onClick={() => {
                                        const url = `${window.location.origin}/p/${intervencion.id}?token=${intervencion.token}`;
                                        window.open(url, '_blank');
                                    }}>
                                        Abrir Portal de Firma
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
