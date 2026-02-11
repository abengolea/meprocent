
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Wrench, Bug, FileText, CheckCircle2 } from "lucide-react";
import { getAlarmById, getEquipoById, mockUsers } from "@/lib/mock-data";
import type { Intervencion, Equipo, VerticalType } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SignaturePad } from "./signature-pad";

const interventionFormSchema = z.object({
  vertical: z.enum(['maintenance', 'pest_control']),
  equipoId: z.string().min(1, "Debe seleccionar un equipo."),
  tipoIntervencion: z.string().min(1, "Debe seleccionar un tipo."),
  prioridad: z.string(),
  tecnicoAsignadoId: z.string().min(1, "Debe asignar un técnico."),
  problemaDetectado: z.string().optional(),
  trabajoRealizado: z.string().min(5, "Detalle el trabajo realizado."),
  chemicalUsed: z.string().optional(),
  chemicalQty: z.string().optional(),
});

type InterventionFormValues = z.infer<typeof interventionFormSchema>;

interface InterventionFormProps {
  intervention?: Intervencion;
  alarmId?: string | null;
  equipoId?: string | null;
}

export function InterventionForm({ intervention, alarmId, equipoId: initialEquipoId }: InterventionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [step, setStep] = useState<'vertical' | 'form' | 'sign'>(intervention ? 'form' : 'vertical');
  const [signature, setSignature] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  
  const tecnicos = mockUsers.filter(u => u.role === 'tecnico' || u.role === 'tecnico_senior');

  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: {
      vertical: 'maintenance',
      prioridad: 'normal',
      tipoIntervencion: 'correctivo',
      trabajoRealizado: '',
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
          if (!targetEquipoId) targetEquipoId = alarm.equipoId;
          setStep('form');
        }
      }

      if (targetEquipoId) {
        const fetchedEquipo = await getEquipoById(targetEquipoId);
        if (fetchedEquipo) {
            setEquipo(fetchedEquipo as any);
            form.setValue('equipoId', fetchedEquipo.id);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [alarmId, initialEquipoId, form]);

  const onSubmit = (data: InterventionFormValues) => {
    setStep('sign');
  };

  const handleFinalize = async (signerName: string, dni: string) => {
    if (!signature) {
      toast({ variant: "destructive", title: "Firma requerida", description: "El encargado debe firmar para cerrar la orden." });
      return;
    }

    setIsClosing(true);
    // Simulación de guardado y generación de PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Orden Cerrada",
      description: "La orden ha sido bloqueada y el PDF se ha generado correctamente.",
    });
    
    router.push("/interventions");
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-64 w-full" /></div>;

  if (step === 'vertical') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
        <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => { form.setValue('vertical', 'maintenance'); setStep('form'); }}>
          <CardHeader className="text-center">
            <Wrench className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Mantenimiento</CardTitle>
            <p className="text-sm text-muted-foreground text-center">Correctivo, Preventivo o Predictivo de Equipos.</p>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => { form.setValue('vertical', 'pest_control'); setStep('form'); }}>
          <CardHeader className="text-center">
            <Bug className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Control de Plagas</CardTitle>
            <p className="text-sm text-muted-foreground text-center">Fumigación, cebado y control de vectores.</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (step === 'sign') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cierre y Firma</CardTitle>
          <p className="text-sm text-muted-foreground">Una vez firmada, la orden no podrá ser editada.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre del Encargado</label>
            <Input id="signerName" placeholder="Juan Pérez" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">DNI / ID</label>
            <Input id="signerDni" placeholder="12.345.678" />
          </div>
          <SignaturePad onSave={setSignature} onClear={() => setSignature(null)} />
          {signature && <p className="text-xs text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Firma capturada</p>}
          <Button 
            className="w-full" 
            disabled={!signature || isClosing} 
            onClick={() => {
              const name = (document.getElementById('signerName') as HTMLInputElement).value;
              const dni = (document.getElementById('signerDni') as HTMLInputElement).value;
              handleFinalize(name, dni);
            }}
          >
            {isClosing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Finalizar y Generar Informe PDF
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isPestControl = form.watch('vertical') === 'pest_control';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md w-fit">
          {isPestControl ? <Bug className="w-4 h-4 text-primary" /> : <Wrench className="w-4 h-4 text-primary" />}
          <span className="text-sm font-semibold">{isPestControl ? 'Control de Plagas' : 'Mantenimiento Electrónico'}</span>
        </div>

        {equipo && (
            <div className="p-4 rounded-lg bg-muted/50 border">
                <h3 className="font-semibold">{equipo.descripcion}</h3>
                <p className="text-sm text-muted-foreground">{equipo.codigoInterno} - {equipo.ubicacion.planta}, {equipo.ubicacion.sector}</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="tipoIntervencion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Servicio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {isPestControl ? (
                      <>
                        <SelectItem value="desinsectacion">Desinsectación</SelectItem>
                        <SelectItem value="desratizacion">Desratización</SelectItem>
                        <SelectItem value="desinfeccion">Desinfección</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="correctivo">Correctivo</SelectItem>
                        <SelectItem value="preventivo">Preventivo</SelectItem>
                        <SelectItem value="inspeccion">Inspección</SelectItem>
                      </>
                    )}
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
                <FormLabel>Técnico</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Asignar" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {tecnicos.map(t => <SelectItem key={t.id} value={t.id}>{t.displayName}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isPestControl && (
          <Card className="bg-muted/30">
            <CardHeader><CardTitle className="text-sm">Tratamiento Químico</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chemicalUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto / Químico</FormLabel>
                    <Select onValueChange={field.onChange}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Seleccione producto" /></SelectTrigger></FormControl>
                       <SelectContent>
                          <SelectItem value="gel_cuca">Gel Cucarachicida Max</SelectItem>
                          <SelectItem value="deltametrina">Deltametrina 2.5%</SelectItem>
                          <SelectItem value="bromadiolona">Bromadiolona (Bloques)</SelectItem>
                       </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chemicalQty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosis / Cantidad</FormLabel>
                    <Input placeholder="Ej: 500ml / 5gr" {...field} />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
        
        <FormField
            control={form.control}
            name="trabajoRealizado"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{isPestControl ? 'Procedimiento Realizado' : 'Detalle del Trabajo'}</FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-between gap-2">
          <Button type="button" variant="outline" onClick={() => setStep('vertical')}>Cambiar Vertical</Button>
          <Button type="submit">Continuar a Firma</Button>
        </div>
      </form>
    </Form>
  );
}
