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
import { Intervencion, Insumo, Consumption } from "@/lib/types";
import { useFirestore, useUser } from "@/firebase";
import { doc, updateDoc, serverTimestamp, collection, getDocs, query, where, arrayUnion } from "firebase/firestore";
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
    ExternalLink,
    ShieldCheck
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
    const [selectedInsumoId, setSelectedInsumoId] = React.useState<string>("");

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

    const handleAddConsumption = async () => {
        if (!selectedInsumoId || !db || isLocked) return;
        const insumo = insumos.find(i => i.id === selectedInsumoId);
        if (!insumo) return;

        const newConsumption: Consumption = {
            type: 'chemical',
            refId: insumo.id,
            name: insumo.name,
            internalCode: insumo.internalCode,
            qty: 1, // Por defecto
            unit: 'gr/ml',
        };

        try {
            await updateDoc(doc(db, 'intervenciones', intervencion.id), {
                consumptions: arrayUnion(newConsumption)
            });
            toast({ title: "Insumo Agregado", description: `${insumo.internalCode} registrado.` });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo registrar el consumo." });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {intervencion.numeroIntervencion}
                        {isLocked && <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1"/> CERTIFICADO</Badge>}
                    </h2>
                    <p className="text-muted-foreground">Expediente Técnico de Control de Plagas</p>
                </div>
                <div className="flex gap-2">
                    {isLocked && (
                        <Button variant="outline" asChild>
                            <a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">
                                <Download className="w-4 h-4 mr-2" />
                                Descargar PDF Certificado
                            </a>
                        </Button>
                    )}
                    {!isLocked ? (
                        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Avance
                        </Button>
                    ) : (
                        <Button variant="ghost" disabled className="text-green-600 font-bold">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Documento Cerrado para Auditoría
                        </Button>
                    )}
                </div>
            </div>

            {!isLocked && (
                <Card className="bg-primary/5 border-primary/20 border-dashed">
                    <CardContent className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-primary">
                            <ExternalLink className="w-5 h-5" />
                            <div>
                                <p className="text-sm font-bold">Link de Certificación para el Cliente</p>
                                <p className="text-[10px] opacity-80 uppercase tracking-widest">Envíe este enlace para firma digital</p>
                            </div>
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
                <TabsList className="grid grid-cols-5 w-full h-auto bg-muted/50 p-1">
                    <TabsTrigger value="solicitud" className="flex flex-col py-3 gap-1"><ClipboardList className="w-4 h-4" /><span className="text-[10px] md:text-xs">Solicitud</span></TabsTrigger>
                    <TabsTrigger value="ejecucion" className="flex flex-col py-3 gap-1"><Play className="w-4 h-4" /><span className="text-[10px] md:text-xs">Ejecución</span></TabsTrigger>
                    <TabsTrigger value="quimicos" className="flex flex-col py-3 gap-1"><FlaskConical className="w-4 h-4" /><span className="text-[10px] md:text-xs">Químicos</span></TabsTrigger>
                    <TabsTrigger value="evidencia" className="flex flex-col py-3 gap-1"><ImageIcon className="w-4 h-4" /><span className="text-[10px] md:text-xs">Evidencia</span></TabsTrigger>
                    <TabsTrigger value="conformidad" className="flex flex-col py-3 gap-1"><ShieldCheck className="w-4 h-4" /><span className="text-[10px] md:text-xs">Firma</span></TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Datos de la Solicitud</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Solicitante</p>
                                    <p className="font-medium text-base">{intervencion.solicitante || 'No especificado'}</p>
                                </div>
                                <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="font-bold text-muted-foreground uppercase text-[10px]">Aviso N°</p>
                                    <p className="font-medium text-base">{intervencion.numeroAviso || 'Entrada Manual'}</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-lg bg-white">
                                <p className="font-bold text-muted-foreground uppercase text-[10px] mb-2">Descripción del Problema Reportado</p>
                                <p className="italic text-secondary leading-relaxed">{intervencion.descripcionProblema || 'Sin descripción previa registrada.'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ejecucion">
                    <Card>
                        <CardHeader><CardTitle className="text-lg">Ejecución Técnica</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold flex items-center gap-2 text-secondary"><User className="w-4 h-4" /> Técnico Responsable</label>
                                <Input value={intervencion.tecnicoSnapshot.displayName} disabled className="bg-muted/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary">Descripción del Procedimiento Técnico</label>
                                <Textarea 
                                    id="trabajoRealizado" 
                                    defaultValue={intervencion.trabajoRealizado} 
                                    disabled={isLocked} 
                                    rows={8} 
                                    placeholder="Describa paso a paso las tareas realizadas, sectores cubiertos y hallazgos relevantes..." 
                                    className="resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quimicos">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Control de Insumos Químicos</CardTitle>
                                <CardDescription>Trazabilidad obligatoria por códigos internos MEPROCENT.</CardDescription>
                            </div>
                            {!isLocked && (
                                <div className="flex gap-2">
                                    <Select value={selectedInsumoId} onValueChange={setSelectedInsumoId}>
                                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Código M01..." /></SelectTrigger>
                                        <SelectContent>
                                            {insumos.map(i => (
                                                <SelectItem key={i.id} value={i.id}>{i.internalCode} - {i.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={handleAddConsumption} disabled={!selectedInsumoId}><Plus className="w-4 h-4 mr-1"/> Registrar</Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-secondary text-secondary-foreground font-bold">
                                        <tr>
                                            <th className="p-3">Código</th>
                                            <th className="p-3">Producto / Registro</th>
                                            <th className="p-3 text-right">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {intervencion.consumptions?.length ? intervencion.consumptions.map((c, i) => (
                                            <tr key={i} className="border-t hover:bg-muted/20 transition-colors">
                                                <td className="p-3 font-mono text-primary font-black">{c.internalCode}</td>
                                                <td className="p-3">{c.name}</td>
                                                <td className="p-3 text-right font-medium">{c.qty} {c.unit}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={3} className="p-12 text-center text-muted-foreground italic bg-muted/10">No se han registrado consumos químicos en este expediente.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evidencia">
                    <Card><CardContent className="py-20 text-center text-muted-foreground flex flex-col items-center gap-4">
                        <div className="p-4 bg-muted rounded-full">
                            <ImageIcon className="w-12 h-12 opacity-30" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-bold text-secondary">Registro Fotográfico de Evidencia</p>
                            <p className="text-xs max-w-xs mx-auto">Las fotos Before/After se almacenan bajo cifrado AES-256 en Firebase Storage restringido.</p>
                        </div>
                        {!isLocked && <Button variant="outline"><ImageIcon className="w-4 h-4 mr-2"/> Cargar Nueva Foto</Button>}
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="conformidad">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Certificación Digital y Cierre</CardTitle>
                            <CardDescription>La firma del cliente bloquea el expediente permanentemente para auditoría.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre del Responsable</label>
                                    <p className="font-bold text-base">{intervencion.signature?.name || 'Pendiente de firma'}</p>
                                </div>
                                <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">DNI / Documento</label>
                                    <p className="font-bold text-base">{intervencion.signature?.dni || 'Pendiente de firma'}</p>
                                </div>
                            </div>
                            
                            {isLocked ? (
                                <div className="border rounded-xl p-8 bg-green-50/50 flex flex-col items-center border-green-200 shadow-inner">
                                    {intervencion.signature?.image && (
                                        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                                            <img src={intervencion.signature.image} alt="Firma Digital" className="max-h-32" />
                                        </div>
                                    )}
                                    <div className="text-center space-y-2">
                                        <p className="font-black text-green-700 uppercase tracking-tighter text-xl">EXPEDIENTE CERTIFICADO</p>
                                        <p className="text-[10px] text-green-600 uppercase font-bold tracking-widest">Sello de Tiempo: {intervencion.closedAt ? formatDate(intervencion.closedAt as any, 'PPPPp') : 'N/A'}</p>
                                    </div>
                                    <Button variant="default" className="mt-8 h-12 px-8 font-bold text-lg shadow-lg" asChild>
                                        <a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">
                                            <Download className="w-5 h-5 mr-2" />
                                            Descargar Reporte PDF Certificado
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/5">
                                    <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                                    <p className="text-sm font-medium text-secondary mb-6">La firma debe realizarse desde el Portal de Cliente para validez legal.</p>
                                    <Button variant="outline" className="h-12 px-6 font-bold border-2" onClick={() => {
                                        const url = `${window.location.origin}/p/${intervencion.id}?token=${intervencion.token}`;
                                        window.open(url, '_blank');
                                    }}>
                                        Abrir Portal de Firma del Cliente
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