
"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from 'react';

import { getEquipoById, getIntervenciones, getPlanes } from '@/lib/mock-data';
import type { Equipo, Intervencion, PlanMantenimiento } from '@/lib/types';
import { generateWorkReport } from "@/ai/flows/generate-work-report-flow";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { Timer, Pause, Camera, FilePlus, ChevronLeft, Mic, Sparkles, Loader2 } from 'lucide-react';

const formSchema = z.object({
    problemaDetectado: z.string().optional(),
    trabajoRealizado: z.string().min(10, "El reporte de trabajo es muy corto."),
    estadoEquipoFinal: z.enum(['operativo', 'requiere_seguimiento', 'fuera_servicio']),
    observaciones: z.string().optional(),
});

// --- Componente para control de voz ---
const VoiceInputControl = ({ onTranscript }: { onTranscript: (text: string) => void }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'es-ES';
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onTranscript(transcript);
                setIsListening(false);
            };
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                 toast({ variant: "destructive", title: "Error de Voz", description: `No se pudo iniciar el reconocimiento: ${event.error}` });
                setIsListening(false);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [toast, onTranscript]);

    const handleToggleListening = () => {
        if (!recognitionRef.current) {
            toast({ variant: "destructive", title: "No Soportado", description: "El reconocimiento de voz no está disponible en este navegador." });
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (error) {
                console.error("Could not start speech recognition:", error);
                toast({ variant: "destructive", title: "Error de Voz", description: "No se pudo iniciar el dictado. Asegúrate de tener los permisos de micrófono activados." });
            }
        }
    };
    
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleListening}
            className={isListening ? 'text-red-500 animate-pulse' : ''}
        >
            <Mic className="h-4 w-4" />
        </Button>
    );
};


export default function FormularioTrabajoPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const intervencionId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [intervencion, setIntervencion] = useState<Intervencion | null>(null);
    const [equipo, setEquipo] = useState<Equipo | null>(null);
    const [plan, setPlan] = useState<PlanMantenimiento | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAiLoading, setIsAiLoading] = useState<"problemaDetectado" | "trabajoRealizado" | "observaciones" | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemaDetectado: "",
            trabajoRealizado: "",
            estadoEquipoFinal: "operativo",
            observaciones: ""
        },
    });
    
    const handleAiAssist = async (fieldName: "problemaDetectado" | "trabajoRealizado" | "observaciones") => {
        const keywords = form.getValues(fieldName);
        if (!keywords || keywords.trim().length < 5) {
            toast({
                variant: "destructive",
                title: "Texto insuficiente",
                description: "Por favor, escribe algunas palabras clave para que la IA pueda ayudarte.",
            });
            return;
        }

        setIsAiLoading(fieldName);
        try {
            const result = await generateWorkReport({
                keywords,
                fieldType: fieldName,
                equipment: equipo!,
            });
            form.setValue(fieldName, result.generatedText);
            toast({
                title: "Texto generado con IA",
                description: "El informe ha sido mejorado.",
            });
        } catch (error) {
            console.error("AI report generation failed:", error);
            toast({
                variant: "destructive",
                title: "Error de IA",
                description: "No se pudo generar el texto. Inténtalo de nuevo.",
            });
        } finally {
            setIsAiLoading(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const todasIntervenciones = await getIntervenciones();
            const interv = todasIntervenciones.find(i => i.id === 'int-progress-1');
            if (interv) {
                setIntervencion(interv);
                const fetchedEquipo = await getEquipoById(interv.equipoId);
                setEquipo(fetchedEquipo || null);
                if (interv.planMantenimientoId) {
                    const todosPlanes = await getPlanes();
                    setPlan(todosPlanes.find(p => p.id === interv.planMantenimientoId) || null);
                }
            } else {
                 toast({ variant: "destructive", title: "Error", description: "Intervención no encontrada." });
            }
            setLoading(false);
        };
        fetchData();
    }, [intervencionId, toast]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        toast({ title: "Borrador Guardado", description: "Tu progreso ha sido guardado." });
    };
    
    const handleFinalizar = () => {
        toast({ title: "Trabajo Finalizado", description: "Enviado a aprobación del supervisor." });
        router.push("/dashboard");
    }

    if (loading || !intervencion || !equipo) {
        return <div className="p-4 space-y-4"><Skeleton className="h-8 w-full"/><Skeleton className="h-96 w-full"/></div>
    }


    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 pb-24">
                <header className="flex items-center justify-between">
                     <Button variant="ghost" size="icon" onClick={() => router.back()} type="button">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">{equipo.codigoInterno}</p>
                        <h1 className="text-lg font-bold">{equipo.descripcion}</h1>
                    </div>
                </header>

                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="pt-6 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <Timer className="h-6 w-6" />
                             <span className="text-2xl font-bold font-mono">00:15:32</span>
                         </div>
                         <Button variant="secondary" size="sm" type="button"><Pause className="h-4 w-4 mr-2"/>Pausar</Button>
                    </CardContent>
                </Card>

                <FormField
                    control={form.control}
                    name="problemaDetectado"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">🔍 Problema Detectado</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Textarea placeholder="Describe el problema o usa el micrófono para dictar..." {...field} className="pr-20" />
                                </FormControl>
                                <div className="absolute top-1 right-1 flex">
                                    <VoiceInputControl onTranscript={(text) => field.onChange(field.value ? `${field.value} ${text}`: text)} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleAiAssist("problemaDetectado")} disabled={isAiLoading !== null}>
                                        {isAiLoading === "problemaDetectado" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="trabajoRealizado"
                    render={({ field }) => (
                         <FormItem>
                            <FormLabel className="text-base font-semibold">🔧 Trabajo Realizado</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Textarea placeholder="Detalla los pasos o usa el micrófono para dictar..." rows={5} {...field} className="pr-20"/>
                                </FormControl>
                                 <div className="absolute top-1 right-1 flex">
                                    <VoiceInputControl onTranscript={(text) => field.onChange(field.value ? `${field.value} ${text}`: text)} />
                                     <Button type="button" variant="ghost" size="icon" onClick={() => handleAiAssist("trabajoRealizado")} disabled={isAiLoading !== null}>
                                        {isAiLoading === "trabajoRealizado" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {plan?.checklistTareas && (
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                             <h3 className="text-base font-semibold">✅ Checklist</h3>
                            {plan.checklistTareas.map(tarea => (
                                <div key={tarea.id} className="flex items-center space-x-2">
                                    <Checkbox id={`tarea-${tarea.id}`} />
                                    <label htmlFor={`tarea-${tarea.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {tarea.descripcion}
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
                
                <Card>
                    <CardContent className="pt-6 space-y-4">
                         <h3 className="text-base font-semibold">🔩 Repuestos, Mediciones y Fotos</h3>
                        <Button variant="outline" className="w-full justify-start" type="button"><FilePlus className="mr-2 h-4 w-4"/>Agregar Repuesto</Button>
                        <Button variant="outline" className="w-full justify-start" type="button"><FilePlus className="mr-2 h-4 w-4"/>Agregar Medición</Button>
                        <Button variant="outline" className="w-full justify-start" type="button"><Camera className="mr-2 h-4 w-4"/>Adjuntar Foto</Button>
                    </CardContent>
                </Card>

                 <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-semibold">📝 Observaciones Adicionales</FormLabel>
                             <div className="relative">
                                <FormControl>
                                    <Textarea placeholder="Recomendaciones, notas, etc." {...field} className="pr-20"/>
                                </FormControl>
                                <div className="absolute top-1 right-1 flex">
                                     <VoiceInputControl onTranscript={(text) => field.onChange(field.value ? `${field.value} ${text}`: text)} />
                                     <Button type="button" variant="ghost" size="icon" onClick={() => handleAiAssist("observaciones")} disabled={isAiLoading !== null}>
                                        {isAiLoading === "observaciones" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="estadoEquipoFinal"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-semibold">⚙️ Estado del Equipo Después</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="operativo">Operativo</SelectItem>
                                <SelectItem value="requiere_seguimiento">Operativo (requiere seguimiento)</SelectItem>
                                <SelectItem value="fuera_servicio">Fuera de servicio</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2">
                    <Button variant="outline" className="flex-1" type="submit">Guardar Borrador</Button>
                    <Button className="flex-1" onClick={handleFinalizar} type="button">Finalizar y Enviar</Button>
                 </div>
            </form>
        </FormProvider>
    );
}

    