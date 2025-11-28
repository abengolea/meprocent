
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn, formatDate, capitalize } from "@/lib/utils";
import { getAlarmById, getEquipoById, mockUsers } from "@/lib/mock-data";
import type { Intervencion, Equipo, Alarma, User } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

const interventionFormSchema = z.object({
  equipoId: z.string({ required_error: "Debe seleccionar un equipo." }),
  tipoIntervencion: z.enum(['correctivo', 'preventivo', 'predictivo', 'inspeccion', 'instalacion', 'emergencia'], {
    required_error: "Debe seleccionar un tipo de intervención.",
  }),
  prioridad: z.enum(['baja', 'normal', 'alta', 'urgente', 'emergencia'], {
    required_error: "Debe seleccionar una prioridad.",
  }),
  tecnicoAsignadoId: z.string({ required_error: "Debe asignar un técnico." }),
  problemaDetectado: z.string().optional(),
  fechaProgramada: z.date().optional(),
});

type InterventionFormValues = z.infer<typeof interventionFormSchema>;

interface InterventionFormProps {
  intervention?: Intervencion;
  alarmId?: string | null;
  equipoId?: string | null;
}

const tiposDeIntervencion = ['correctivo', 'preventivo', 'predictivo', 'inspeccion', 'instalacion', 'emergencia'];
const prioridades = ['baja', 'normal', 'alta', 'urgente', 'emergencia'];

export function InterventionForm({ intervention, alarmId, equipoId: initialEquipoId }: InterventionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  
  const tecnicos = mockUsers.filter(u => u.role === 'tecnico' || u.role === 'tecnico_senior');

  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: {
      prioridad: 'normal',
      tipoIntervencion: 'correctivo',
    },
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let targetEquipoId = initialEquipoId;
      
      if (alarmId) {
        const alarm = await getAlarmById(alarmId);
        if (alarm) {
          form.setValue('problemaDetectado', alarm.mensaje);
          form.setValue('prioridad', alarm.severidad === 'critica' || alarm.severidad === 'alta' ? 'urgente' : 'normal');
          form.setValue('tipoIntervencion', 'correctivo');
          if (!targetEquipoId) {
            targetEquipoId = alarm.equipoId;
          }
        }
      }

      if (targetEquipoId) {
        const fetchedEquipo = await getEquipoById(targetEquipoId);
        if (fetchedEquipo) {
            setEquipo(fetchedEquipo);
            form.setValue('equipoId', fetchedEquipo.id);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [alarmId, initialEquipoId, form]);

  async function onSubmit(data: InterventionFormValues) {
    setLoading(true);
    
    console.log("Nueva intervención:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Intervención Creada",
      description: `Se ha asignado una nueva intervención para el equipo ${equipo?.codigoInterno}.`,
    });
    router.push("/interventions");
    setLoading(false);
  }

  if (loading) {
    return <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-32 ml-auto" />
    </div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        
        {equipo && (
            <div className="p-4 rounded-lg bg-muted">
                <h3 className="font-semibold text-foreground">{equipo.descripcion}</h3>
                <p className="text-sm text-muted-foreground">{equipo.codigoInterno} - {equipo.ubicacion.planta}, {equipo.ubicacion.sector}</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="tipoIntervencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Intervención</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccione un tipo" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposDeIntervencion.map(tipo => (
                      <SelectItem key={tipo} value={tipo}>{capitalize(tipo)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prioridad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccione una prioridad" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {prioridades.map(p => (
                      <SelectItem key={p} value={p}>{capitalize(p)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tecnicoAsignadoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Técnico Asignado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccione un técnico" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tecnicos.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
                control={form.control}
                name="fechaProgramada"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Programada (Opcional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        formatDate(field.value, 'PPP')
                                    ) : (
                                        <span>Seleccionar fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormDescription>Fecha en la que se debería realizar el trabajo.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="problemaDetectado"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Descripción del Problema o Tarea</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Describa el problema reportado o la tarea de mantenimiento a realizar..."
                            rows={4}
                            {...field}
                            disabled={loading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !equipo}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Creando..." : "Crear Intervención"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
