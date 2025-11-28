
"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from 'react';

import { getEquipoById, getIntervenciones, getPlanes } from '@/lib/mock-data';
import type { Equipo, Intervencion, PlanMantenimiento } from '@/lib/types';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { Timer, Pause, Camera, HardHat, FilePlus, ChevronLeft } from 'lucide-react';

const formSchema = z.object({
    problemaDetectado: z.string().optional(),
    trabajoRealizado: z.string().min(10, "El reporte de trabajo es muy corto."),
    estadoEquipoFinal: z.enum(['operativo', 'requiere_seguimiento', 'fuera_servicio']),
    observaciones: z.string().optional(),
    // Campos complejos que manejaremos por separado
    // mediciones, checklist, repuestos, fotos, firma
});

export default function FormularioTrabajoPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();

    // El ID aquí es de la intervención, no del equipo
    const intervencionId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [intervencion, setIntervencion] = useState<Intervencion | null>(null);
    const [equipo, setEquipo] = useState<Equipo | null>(null);
    const [plan, setPlan] = useState<PlanMantenimiento | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemaDetectado: "",
            trabajoRealizado: "",
            estadoEquipoFinal: "operativo",
            observaciones: ""
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const todasIntervenciones = await getIntervenciones();
            // Simulación: Buscamos la intervención por ID. En una app real, sería una query directa.
            const interv = todasIntervenciones.find(i => i.id === 'int-progress-1'); // Forzamos una para el demo
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
        // Lógica de finalización
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

                {/* Cronómetro y Estado */}
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="pt-6 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <Timer className="h-6 w-6" />
                             <span className="text-2xl font-bold font-mono">00:15:32</span>
                         </div>
                         <Button variant="secondary" size="sm" type="button"><Pause className="h-4 w-4 mr-2"/>Pausar</Button>
                    </CardContent>
                </Card>

                {/* Formulario Principal */}
                <FormField
                    control={form.control}
                    name="problemaDetectado"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-semibold">🔍 Problema Detectado</FormLabel>
                        <FormControl><Textarea placeholder="Describe el problema que encontraste..." {...field} /></FormControl>
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
                        <FormControl><Textarea placeholder="Detalla los pasos que seguiste..." rows={5} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Checklist (si hay plan) */}
                {plan?.checklistTareas && (
                    <Card>
                        <CardHeader><CardTitle>✅ Checklist</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
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

                {/* Repuestos, Mediciones y Fotos */}
                <Card>
                    <CardHeader><CardTitle>🔩 Repuestos, Mediciones y Fotos</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full" type="button"><FilePlus className="mr-2 h-4 w-4"/>Agregar Repuesto</Button>
                        <Button variant="outline" className="w-full" type="button"><FilePlus className="mr-2 h-4 w-4"/>Agregar Medición</Button>
                        <Button variant="outline" className="w-full" type="button"><Camera className="mr-2 h-4 w-4"/>Adjuntar Foto</Button>
                    </CardContent>
                </Card>

                 <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-base font-semibold">📝 Observaciones Adicionales</FormLabel>
                        <FormControl><Textarea placeholder="Recomendaciones, notas, etc." {...field} /></FormControl>
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
                
                 {/* Barra de acciones inferior fija */}
                 <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2">
                    <Button variant="outline" className="flex-1" type="submit">Guardar Borrador</Button>
                    <Button className="flex-1" onClick={handleFinalizar} type="button">Finalizar y Enviar</Button>
                 </div>
            </form>
        </FormProvider>
    );
}
