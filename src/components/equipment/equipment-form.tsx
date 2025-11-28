
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
import { useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

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
});

type EquipmentFormValues = z.infer<typeof equipmentFormSchema>;

const tiposDeEquipo = [
    { value: 'motor', label: 'Motor' },
    { value: 'bomba', label: 'Bomba' },
    { value: 'tablero_electrico', label: 'Tablero Eléctrico' },
    { value: 'ups', label: 'UPS' },
    { value: 'transformador', label: 'Transformador' },
    { value: 'otro', label: 'Otro' },
]

export function EquipmentForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      codigoInterno: "",
      descripcion: "",
      planta: "Planta Principal", // Default value
    },
  });

  async function onSubmit(data: EquipmentFormValues) {
    setLoading(true);
    
    // Generar el qrCodeId automáticamente
    const qrCodeId = `qr-${data.codigoInterno.toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
    const newData = { ...data, qrCodeId };

    console.log("Datos del nuevo equipo:", newData);
    
    // Simular llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Equipo Creado",
      description: `El equipo ${data.descripcion} ha sido agregado al inventario.`,
    });

    router.push("/equipment");
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
                        <Input placeholder="Ej: MOT-001" {...field} disabled={loading} />
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
                        <Input placeholder="Ej: Planta Principal" {...field} disabled={loading}/>
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

        </div>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Guardando..." : "Agregar Equipo"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
