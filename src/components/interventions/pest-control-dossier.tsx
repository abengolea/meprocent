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
import { useFirestore, useUser, useStorage } from "@/firebase";
import { doc, updateDoc, serverTimestamp, collection, getDocs, query, where, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

export function PestControlDossier({ intervencion }: { intervencion: Intervencion & { id: string } }) {
    const { toast } = useToast();
    const db = useFirestore();
    const storage = useStorage();
    const { profile } = useUser();
    
    const [activeTab, setActiveTab] = React.useState("solicitud");
    const [isSaving, setIsSaving] = React.useState(false);
    const [insumos, setInsumos] = React.useState<Insumo[]>([]);
    const [selectedInsumoId, setSelectedInsumoId] = React.useState<string>("");
    const [evidence, setEvidence] = React.useState<{ url: string; caption?: string }[]>(intervencion.evidence || []);
    const [uploading, setUploading] = React.useState(false);

    const isLocked = intervencion.locked === true;

    React.useEffect(() => {
        setEvidence(intervencion.evidence || []);
    }, [intervencion.evidence]);

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
            const trabajoRealizado = (document.getElementById('trabajoRealizado') as HTMLTextAreaElement)?.value;
            await updateDoc(doc(db, 'intervenciones', intervencion.id), {
                trabajoRealizado,
                updatedAt: serverTimestamp()
            });

            await writeAuditLog({
                db, interventionId: intervencion.id, action: "UPDATED",
                userId: profile.id, userName: profile.displayName,
                payload: { field: 'trabajoRealizado' }
            });

            toast({ title: "Guardado", description: "Expediente actualizado." });
        } catch (e) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo guardar." });
        } finally { setIsSaving(false); }
    };

    const handleAddConsumption = async () => {
        if (!selectedInsumoId || !db || isLocked) return;
        const insumo = insumos.find(i => i.id === selectedInsumoId);
        if (!insumo) return;

        const newConsumption: Consumption = {
            type: 'chemical', refId: insumo.id, name: insumo.name,
            internalCode: insumo.internalCode, qty: 1, unit: 'gr/ml',
        };

        try {
            await updateDoc(doc(db, 'intervenciones', intervencion.id), {
                consumptions: arrayUnion(newConsumption)
            });
            toast({ title: "Insumo Agregado", description: `${insumo.internalCode} registrado.` });
        } catch (e) { toast({ variant: "destructive", title: "Error", description: "No se pudo registrar." }); }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !storage || !db || isLocked) return;
        if (!file.type.startsWith('image/')) {
            toast({ variant: "destructive", title: "Error", description: "Solo se permiten imágenes." });
            return;
        }
        setUploading(true);
        try {
            const path = `intervenciones/${intervencion.id}/evidence/${Date.now()}-${file.name}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            const newEvidence = { url, caption: "", uploadedAt: new Date().toISOString() };
            await updateDoc(doc(db, 'intervenciones', intervencion.id), {
                evidence: arrayUnion(newEvidence)
            });
            setEvidence(prev => [...prev, newEvidence]);
            toast({ title: "Foto subida", description: "La evidencia ha sido guardada." });
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "No se pudo subir la foto." });
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {intervencion.numeroIntervencion}
                        {isLocked && <Badge className="bg-green-100 text-green-800"><ShieldCheck className="w-3 h-3 mr-1"/> CERTIFICADO</Badge>}
                    </h2>
                    <p className="text-muted-foreground text-sm">Expediente Técnico MEPROCENT</p>
                </div>
                <div className="flex gap-2">
                    {isLocked && (
                        <Button variant="outline" asChild>
                            <a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">
                                <Download className="w-4 h-4 mr-2" /> Descargar PDF
                            </a>
                        </Button>
                    )}
                    {!isLocked ? (
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    ) : <Badge variant="outline" className="text-green-600">Documento Bloqueado</Badge>}
                </div>
            </div>

            {!isLocked && (
                <Card className="bg-primary/5 border-primary/20 border-dashed">
                    <CardContent className="py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-primary">
                            <ExternalLink className="w-5 h-5" />
                            <p className="text-sm font-bold">Link para el Cliente</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                            const url = `${window.location.origin}/certificar/${intervencion.id}?token=${intervencion.token}`;
                            navigator.clipboard.writeText(url);
                            toast({ title: "Link copiado" });
                        }}>Copiar URL</Button>
                    </CardContent>
                </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="solicitud"><ClipboardList className="w-4 h-4"/></TabsTrigger>
                    <TabsTrigger value="ejecucion"><Play className="w-4 h-4"/></TabsTrigger>
                    <TabsTrigger value="quimicos"><FlaskConical className="w-4 h-4"/></TabsTrigger>
                    <TabsTrigger value="evidencia"><ImageIcon className="w-4 h-4"/></TabsTrigger>
                    <TabsTrigger value="conformidad"><ShieldCheck className="w-4 h-4"/></TabsTrigger>
                </TabsList>

                <TabsContent value="solicitud">
                    <Card><CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-muted rounded-lg"><p className="text-[10px] font-bold">SOLICITANTE</p><p>{intervencion.solicitante || 'N/A'}</p></div>
                            <div className="p-3 bg-muted rounded-lg"><p className="text-[10px] font-bold">AVISO N°</p><p>{intervencion.numeroAviso || 'MANUAL'}</p></div>
                        </div>
                        <div className="p-4 border rounded-lg bg-white italic">{intervencion.descripcionProblema || 'Sin descripción.'}</div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="ejecucion">
                    <Card><CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Técnico Responsable</label>
                            <Input value={intervencion.tecnicoSnapshot.displayName} disabled />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Descripción del Procedimiento</label>
                            <Textarea id="trabajoRealizado" defaultValue={intervencion.trabajoRealizado} disabled={isLocked} rows={8} />
                        </div>
                    </CardContent></Card>
                </TabsContent>

                <TabsContent value="quimicos">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Control de Insumos</CardTitle>
                            {!isLocked && (
                                <div className="flex gap-2">
                                    <Select value={selectedInsumoId} onValueChange={setSelectedInsumoId}>
                                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Insumo..." /></SelectTrigger>
                                        <SelectContent>{insumos.map(i => <SelectItem key={i.id} value={i.id}>{i.internalCode}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Button size="sm" onClick={handleAddConsumption} disabled={!selectedInsumoId}>+</Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead><tr className="bg-secondary text-secondary-foreground"><th className="p-2">Cód</th><th className="p-2">Nombre</th><th className="p-2">Cant</th></tr></thead>
                                <tbody>
                                    {intervencion.consumptions?.map((c, i) => <tr key={i} className="border-t"><td className="p-2 font-bold">{c.internalCode}</td><td className="p-2">{c.name}</td><td className="p-2">{c.qty}</td></tr>)}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="evidencia">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Fotos de Evidencia</CardTitle>
                            <CardDescription>Documente el trabajo realizado con fotografías.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!isLocked && (
                                <div className="mb-6">
                                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                                        <span>{uploading ? "Subiendo..." : "Agregar foto"}</span>
                                    </label>
                                </div>
                            )}
                            {evidence.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {evidence.map((item, i) => (
                                        <div key={i} className="relative group rounded-lg overflow-hidden border">
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block aspect-square">
                                                <img src={item.url} alt={item.caption || `Evidencia ${i + 1}`} className="w-full h-full object-cover" />
                                            </a>
                                            {item.caption && <p className="p-2 text-xs text-muted-foreground truncate">{item.caption}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <ImageIcon className="w-12 h-12 mx-auto opacity-30 mb-2" />
                                    <p>No hay fotos de evidencia.</p>
                                    {!isLocked && <p className="text-sm mt-1">Use el botón arriba para agregar fotos.</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="conformidad">
                    <Card><CardContent className="pt-6 text-center">
                        {isLocked ? (
                            <div className="space-y-4">
                                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
                                <p className="font-bold">CERTIFICADO DIGITALMENTE</p>
                                <Button asChild><a href={`/api/intervenciones/${intervencion.id}/pdf?token=${intervencion.token}`} target="_blank">PDF Oficial</a></Button>
                            </div>
                        ) : (
                            <Button variant="outline" onClick={() => window.open(`/certificar/${intervencion.id}?token=${intervencion.token}`, '_blank')}>Abrir Portal de Firma</Button>
                        )}
                    </CardContent></Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}