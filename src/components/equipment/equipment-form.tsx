
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Equipo } from "@/lib/types";
import { Separator } from "../ui/separator";

const equipmentFormSchema = z.object({
  codigoInterno: z.string().min(3, "El código debe tener al menos 3 caracteres."),
  descripcion: z.string().min(5, "La descripción es muy corta."),
  tipoEquipo: z.enum(['tablero_electrico', 'motor', 'bomba', 'ups', 'transformador', 'otro'], {
    required_error: "Debe seleccionar un tipo de equipo.",
  }),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  numeroSerie: z.string().optional(),
  planta: z.string().min(1, "La planta es requerida."),
  sector: z.string().min(1, "El sector es requerido."),
  fechaInstalacion: z.date().optional(),
  garantiaHasta: z.date().optional(),
  // Características técnicas opcionales
  potencia: z.string().optional(),
  voltaje: z.string().optional(),
  corriente: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

interface EquipmentFormProps {
  equipo?: Equipo;
}

const tiposDeEquipo = [
    { value: 'motor', label: 'Motor' },
    { value: 'bomba', label: 'Bomba' },
    { value: 'tablero_electrico', label: 'Tablero Eléctrico' },
    { value: 'ups', label: 'UPS' },
    { value: 'transformador', label: 'Transformador' },
    { value: 'otro', label: 'Otro' },
]

export function EquipmentForm({ equipo }: EquipmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isEditMode = !!equipo;
  
  // Asumimos que el usuario pertenece a la empresa 'empresa-1'
  const userEmpresaId = 'empresa-1';

  useEffect(() => {
    setIsClient(true);
  }, []);

  const defaultValues = isEditMode ? {
    ...equipo,
    planta: equipo.ubicacion.planta,
    sector: equipo.ubicacion.sector,
    fechaInstalacion: equipo.fechaInstalacion ? new Date(equipo.fechaInstalacion as string) : undefined,
    garantiaHasta: equipo.garantiaHasta ? new Date(equipo.garantiaHasta as string) : undefined,
    potencia: equipo.caracteristicasTecnicas?.potencia || "",
    voltaje: equipo.caracteristicasTecnicas?.voltaje || "",
    corriente: equipo.caracteristicasTecnicas?.corriente || "",
  } : {
      codigoInterno: "",
      descripcion: "",
      planta: "Planta Principal", // Valor por defecto de la empresa del usuario
      sector: "",
      potencia: "",
      voltaje: "",
      corriente: "",
  };

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    // @ts-ignore
    defaultValues,
  });

  async function onSubmit(data: EquipmentFormValues) {
    setLoading(true);
    
    // Agrupar características técnicas
    const { potencia, voltaje, corriente, ...restOfData } = data;
    const caracteristicasTecnicas = { potencia, voltaje, corriente };
    
    const finalData = { ...restOfData, caracteristicasTecnicas };

    if (isEditMode) {
      console.log("Datos del equipo a actualizar:", { ...equipo, ...finalData });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Equipo Actualizado",
        description: `El equipo ${data.descripcion} ha sido actualizado.`,
      });
      router.push(`/equipment/${equipo.id}`);
      router.refresh(); // Forzar la actualización de la página de detalles
    } else {
      const qrCodeId = `qr-${data.codigoInterno.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
      const newData = { ...finalData, qrCodeId, empresaId: userEmpresaId };

      console.log("Datos del nuevo equipo:", newData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Equipo Creado",
        description: `El equipo ${data.descripcion} ha sido agregado al inventario.`,
      });
      router.push("/equipment");
    }
    
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
                control={form.control}
                name="codigoInterno"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Código Interno</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: MOT-001" {...field} disabled={loading || isEditMode} />
                    </FormControl>
                    <FormDescription>Identificador único del equipo.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Motor de cinta transportadora" {...field} disabled={loading} />
                    </FormControl>
                    <FormDescription>Nombre descriptivo y claro del equipo.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="tipoEquipo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {tiposDeEquipo.map(tipo => (
                            <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="planta"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Planta</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Planta Principal" {...field} disabled={true}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Sector</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Línea de Producción 2" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fabricante"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fabricante (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Siemens" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: 1LE1" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="numeroSerie"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Serie (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: SN-12345ABC" {...field} disabled={loading}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {isClient && <>
                <FormField
                    control={form.control}
                    name="fechaInstalacion"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fecha de Instalación (Opcional)</FormLabel>
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
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="garantiaHasta"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Garantía hasta (Opcional)</FormLabel>
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
                                        disabled={(date) =>
                                        date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </>}

        </div>
        
        <Separator />
        
        <div>
            <h3 className="text-lg font-medium">Características Técnicas</h3>
            <p className="text-sm text-muted-foreground">
                Especifique los detalles técnicos del equipo (opcional).
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
                    control={form.control}
                    name="potencia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Potencia</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 5.5 kW" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            <FormField
                    control={form.control}
                    name="voltaje"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Voltaje</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 380V" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            <FormField
                    control={form.control}
                    name="corriente"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Corriente</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 11.5A" {...field} disabled={loading}/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
        </div>


        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Agregar Equipo")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
