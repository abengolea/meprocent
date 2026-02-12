
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
import { Loader2, Wrench, Bug, FileText, Lock } from "lucide-react";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { writeAuditLog } from "@/lib/audit";
import type { Intervencion, Equipo } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const interventionFormSchema = z.object({
  vertical: z.enum(['maintenance', 'pest_control']),
  equipoId: z.string().min(1, "Debe seleccionar un equipo."),
  tipoIntervencion: z.string().min(1, "Debe seleccionar un tipo."),
  prioridad: z.string(),
  tecnicoAsignadoId: z.string().min(1, "Debe asignar un técnico."),
  trabajoRealizado: z.string().min(5, "Detalle el trabajo realizado."),
});

type InterventionFormValues = z.infer<typeof interventionFormSchema>;

interface InterventionFormProps {
  intervention?: Intervencion & { id: string };
  equipoId?: string | null;
}

export function InterventionForm({ intervention, equipoId: initialEquipoId }: InterventionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const { profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [step, setStep] = useState<'vertical' | 'form'>(intervention ? 'form' : 'vertical');
  const [isClosing, setIsClosing] = useState(false);

  const isLocked = intervention?.locked === true;

  const form = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionFormSchema),
    defaultValues: intervention ? {
        vertical: intervention.vertical,
        equipoId: intervention.equipoId,
        tipoIntervencion: intervention.tipoIntervencion,
        prioridad: 'normal',
        trabajoRealizado: intervention.trabajoRealizado,
        tecnicoAsignadoId: intervention.tecnicoId
    } : {
      vertical: 'maintenance',
      prioridad: 'normal',
      tipoIntervencion: 'correctivo',
      trabajoRealizado: '',
      tecnicoAsignadoId: profile?.id || '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      if (!db) return;
      setLoading(true);
      
      const targetId = intervention?.equipoId || initialEquipoId;
      if (targetId) {
        const equipoDoc = await getDoc(doc(db, 'equipos', targetId));
        if (equipoDoc.exists()) {
          const eqData = equipoDoc.data() as Equipo;
          setEquipo({ ...eqData, id: equipoDoc.id });
          form.setValue('equipoId', equipoDoc.id);
          setStep('form');
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [db, initialEquipoId, intervention, form]);

  const onSubmit = async (data: InterventionFormValues) => {
    if (!db || !profile || !equipo || isLocked) return;

    setIsClosing(true);
    try {
      const docData: Omit<Intervencion, 'id'> = {
        vertical: data.vertical,
        locked: false,
        token: intervention?.token || Math.random().toString(36).substring(2, 15),
        numeroIntervencion: intervention?.numeroIntervencion || `INT-${Date.now().toString().slice(-6)}`,
        equipoId: equipo.id,
        equipoSnapshot: {
          codigoInterno: equipo.codigoInterno,
          descripcion: equipo.descripcion,
          ubicacion: `${equipo.ubicacion.planta} - ${equipo.ubicacion.sector}`,
        },
        tipoIntervencion: data.tipoIntervencion,
        tecnicoId: profile.id,
        tecnicoSnapshot: {
          displayName: profile.displayName,
          email: profile.email,
        },
        estado: 'en_progreso',
        empresaId: profile.empresaId,
        trabajoRealizado: data.trabajoRealizado,
        fechaInicio: intervention?.fechaInicio || serverTimestamp() as any,
      };

      let docId = intervention?.id;
      if (intervention) {
          await updateDoc(doc(db, 'intervenciones', intervention.id), docData);
      } else {
          const newDoc = await addDoc(collection(db, 'intervenciones'), docData);
          docId = newDoc.id;
      }
      
      await writeAuditLog({
        db,
        interventionId: docId!,
        action: intervention ? "UPDATED" : "CREATED",
        userId: profile.id,
        userName: profile.displayName,
        payload: { vertical: data.vertical, type: data.tipoIntervencion }
      });

      toast({ title: "Éxito", description: "Intervención guardada." });
      router.push("/interventions");
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Fallo al guardar." });
    } finally {
      setIsClosing(false);
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-64 w-full" /></div>;

  if (isLocked) {
      return (
          <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center gap-4 text-center">
              <Lock className="w-12 h-12 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-bold">Intervención Bloqueada</h3>
              <p className="text-muted-foreground max-w-md">Este registro ha sido certificado y bloqueado para auditoría. No se permiten más modificaciones.</p>
              <Button variant="outline" onClick={() => router.back()}>Volver al listado</Button>
          </div>
      )
  }

  if (step === 'vertical') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
        <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => { form.setValue('vertical', 'maintenance'); setStep('form'); }}>
          <CardHeader className="text-center">
            <Wrench className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Mantenimiento</CardTitle>
            <p className="text-sm text-muted-foreground">Correctivo, Preventivo o Predictivo.</p>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => { form.setValue('vertical', 'pest_control'); setStep('form'); }}>
          <CardHeader className="text-center">
            <Bug className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle>Control de Plagas</CardTitle>
            <p className="text-sm text-muted-foreground">Fumigación y control de vectores.</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
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
                    {form.watch('vertical') === 'pest_control' ? (
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
                <FormControl><Input {...field} disabled value={profile?.displayName || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="trabajoRealizado"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Detalle del Trabajo</FormLabel>
                    <FormControl><Textarea rows={4} {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div className="flex justify-between gap-2">
          {!intervention && <Button type="button" variant="outline" onClick={() => setStep('vertical')}>Cambiar Vertical</Button>}
          <Button type="submit" disabled={isClosing}>
            {isClosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {intervention ? 'Guardar Cambios' : 'Iniciar Intervención'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
