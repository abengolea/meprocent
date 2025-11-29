
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Empresa } from "@/lib/types";

const empresaFormSchema = z.object({
  razonSocial: z.string().min(3, "La razón social es muy corta."),
  nombreComercial: z.string().optional(),
  cuit: z.string().min(11, "El CUIT debe tener 11 dígitos.").max(11, "El CUIT debe tener 11 dígitos.").optional(),
  activa: z.boolean().default(true),
});

type EmpresaFormValues = z.infer<typeof empresaFormSchema>;

interface EmpresaFormProps {
  empresa?: Empresa;
}

export function EmpresaForm({ empresa }: EmpresaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!empresa;

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues: isEditMode ? empresa : {
      razonSocial: "",
      nombreComercial: "",
      cuit: "",
      activa: true,
    },
  });

  async function onSubmit(data: EmpresaFormValues) {
    setLoading(true);

    if (isEditMode) {
      console.log("Datos de la empresa a actualizar:", { ...empresa, ...data });
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Empresa Actualizada",
        description: `Los datos de ${data.razonSocial} han sido actualizados.`,
      });
      router.push(`/empresas/${empresa.id}`);
    } else {
      console.log("Datos de la nueva empresa:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Empresa Creada",
        description: `La empresa ${data.razonSocial} ha sido agregada al sistema.`,
      });
      router.push("/empresas");
    }
    
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="razonSocial"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Razón Social</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Mi Empresa S.A." {...field} disabled={loading} />
                    </FormControl>
                    <FormDescription>Nombre fiscal de la empresa.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="nombreComercial"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nombre Comercial (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: Mi Empresa" {...field} disabled={loading} />
                    </FormControl>
                    <FormDescription>Nombre de fantasía o marca.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="cuit"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>CUIT (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="Ej: 30778899112" {...field} disabled={loading} />
                    </FormControl>
                    <FormDescription>CUIT sin guiones.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="activa"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">
                            Empresa Activa
                        </FormLabel>
                        <FormDescription>
                            Las empresas inactivas no aparecerán en las listas de selección.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={loading}
                        />
                    </FormControl>
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
                {loading ? "Guardando..." : (isEditMode ? "Guardar Cambios" : "Crear Empresa")}
            </Button>
        </div>
      </form>
    </Form>
  );
}
