
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Intervencion, Insumo, Consumption } from "@/lib/types";
import { mockInsumos } from "@/lib/mock-data";
import { SignaturePad } from "./signature-pad";
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
    intervencion: Intervencion;
    isPublic?: boolean;
}

export function PestControlDossier({ intervencion, isPublic = false }: PestControlDossierProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = React.useState("solicitud");
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLocked, setIsLocked] = React.useState(intervencion.locked);
    const [signature, setSignature] = React.useState<string | null>(intervencion.signature?.image || null);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: "Cambios guardados", description: "El expediente ha sido actualizado." });
        setIsSaving(false);
    };

    const handleFinalize = async (signerName: string, dni: string) => {
        if (!signature) {
            toast({ variant: "destructive", title: "Error", description: "La firma es obligatoria para cerrar el expediente." });
            return;
        }
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLocked(true);
        toast({ title: "Expediente Certificado", description: "El documento ha sido bloqueado y sellado legalmente." });
        setIsSaving(false);
    };

    const disabled = isLocked || (isPublic && activeTab !== 'conformidad');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {intervencion.numeroIntervencion}
                        {isLocked && <Badge variant="secondary" className="ml-2"><Lock className="w-3 h-3 mr-1"/> Cerrado</Badge>}
                    </h2>
                    <p className="text-muted-foreground">Expediente de Servicio de Control de Plagas</p>
                </div>
                {!isLocked && !isPublic && (
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
                        <span className="text-[10px] md:text-xs">Químicos</span>
                    </TabsTrigger>
                    <TabsTrigger value="evidencia" className="flex flex-col py-2 gap-1">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Evidencia</span>
                    </TabsTrigger>
                    <TabsTrigger value="conformidad" className="flex flex-col py-2 gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] md:text-xs">Firma</span>
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: SOLICITUD */}
                <TabsContent value="solicitud">
                    <Card>
                        <CardHeader>
                            <CardTitle>Datos del Aviso</CardTitle>
                            <CardDescription>Información sobre la solicitud del servicio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">N° de Aviso</label>
                                    <Input defaultValue={intervencion.numeroAviso} disabled={disabled} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Solicitante</label>
                                    <Input defaultValue={intervencion.solicitante} disabled={disabled} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripción del Problema</label>
                                <Textarea defaultValue={intervencion.descripcionProblema} disabled={disabled} rows={4} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: EJECUCION */}
                <TabsContent value="ejecucion">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de la Tarea</CardTitle>
                            <CardDescription>Registro de tiempos y procedimientos realizados.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Hora de Llegada</label>
                                    <Input type="time" disabled={disabled} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" /> Hora de Salida</label>
                                    <Input type="time" disabled={disabled} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Operario Interviniente</label>
                                <Input defaultValue={intervencion.tecnicoSnapshot.displayName} disabled={true} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Procedimiento Técnico</label>
                                <Textarea defaultValue={intervencion.trabajoRealizado} disabled={disabled} rows={6} placeholder="Describa detalladamente qué hizo..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: QUIMICOS */}
                <TabsContent value="quimicos">
                    <Card>
                        <CardHeader>
                            <CardTitle>Control de Insumos</CardTitle>
                            <CardDescription>Selección por código interno (M01, M02...).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border rounded-md">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="p-2 text-left">Código</th>
                                            <th className="p-2 text-left">Nombre Comercial</th>
                                            <th className="p-2 text-left">Dosis</th>
                                            <th className="p-2 text-left">Método</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {intervencion.consumptions?.filter(c => c.type === 'chemical').map((c, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="p-2 font-mono font-bold text-primary">{c.internalCode}</td>
                                                <td className="p-2">{c.name}</td>
                                                <td className="p-2">{c.qty} {c.unit}</td>
                                                <td className="p-2">{c.method}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!disabled && (
                                <Button variant="outline" className="w-full">
                                    <FlaskConical className="w-4 h-4 mr-2" /> Agregar Químico (Selector de Código)
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 4: EVIDENCIA */}
                <TabsContent value="evidencia">
                    <Card>
                        <CardHeader>
                            <CardTitle>Registro Fotográfico</CardTitle>
                            <CardDescription>Fotos Antes / Después para soporte legal.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center border-2 border-dashed">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-[10px] mt-2">Subir Foto Antes</span>
                                </div>
                                <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center border-2 border-dashed">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                    <span className="text-[10px] mt-2">Subir Foto Después</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 5: CONFORMIDAD */}
                <TabsContent value="conformidad">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conformidad del Cliente</CardTitle>
                            <CardDescription>La firma bloquea el documento permanentemente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombre del Responsable</label>
                                    <Input id="signerName" placeholder="Nombre completo" disabled={isLocked} defaultValue={intervencion.signature?.name} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">DNI / ID</label>
                                    <Input id="signerDni" placeholder="Número de documento" disabled={isLocked} defaultValue={intervencion.signature?.dni} />
                                </div>
                            </div>
                            
                            {isLocked ? (
                                <div className="border rounded-md p-4 bg-muted/50 flex flex-col items-center">
                                    <img src={signature || ""} alt="Firma" className="max-h-32 mb-2" />
                                    <div className="text-center text-xs text-muted-foreground">
                                        <p>Documento firmado electrónicamente</p>
                                        <p>Fecha: {intervencion.closedAt ? formatDate(intervencion.closedAt as any, 'PPPPp') : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
                                    <Button 
                                        className="w-full h-12 text-lg" 
                                        disabled={!signature || isSaving}
                                        onClick={() => {
                                            const name = (document.getElementById('signerName') as HTMLInputElement).value;
                                            const dni = (document.getElementById('signerDni') as HTMLInputElement).value;
                                            handleFinalize(name, dni);
                                        }}
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                                        Firmar y Certificar Expediente
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
