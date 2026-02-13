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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const userFormSchema = z.object({
  displayName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor ingrese un correo válido."),
  role: z.enum(["admin", "supervisor", "tecnico_senior", "tecnico"], {
    required_error: "Debe seleccionar un rol.",
  }),
  // Perfil Técnico condicional
  especialidad: z.string().optional(),
  turno: z.enum(["mañana", "tarde", "noche", "rotativo"]).optional(),
  nivelExperiencia: z.enum(["junior", "intermedio", "senior"]).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const rolesDisponibles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'tecnico_senior', label: 'Técnico Senior' },
    { value: 'tecnico', label: 'Técnico' },
]

export function UserForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  const selectedRole = form.watch("role");
  const isTecnico = selectedRole === "tecnico" || selectedRole === "tecnico_senior";


  async function onSubmit(data: UserFormValues) {
    setLoading(true);
    console.log("Datos del nuevo usuario:", data);
    
    // Simular llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Usuario Creado",
      description: `El usuario ${data.displayName} ha sido creado con éxito.`,
    });

    router.push("/usuarios");
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                    <Input placeholder="Ej: Juan Pérez" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="nombre@ejemplo.com" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Rol del usuario</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {rolesDisponibles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                            {role.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        {isTecnico && (
            <>
            <Separator />
            <div>
                <h3 className="text-lg font-medium">Perfil Técnico</h3>
                <p className="text-sm text-muted-foreground">
                    Complete los detalles específicos para este rol técnico.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="especialidad"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Especialidad Principal</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Electricidad" {...field} disabled={loading}/>
                        </FormControl>
                        <FormDescription>La principal área de experiencia del técnico.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="turno"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Turno de Trabajo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un turno" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="mañana">Mañana</SelectItem>
                                <SelectItem value="tarde">Tarde</SelectItem>
                                <SelectItem value="noche">Noche</SelectItem>
                                <SelectItem value="rotativo">Rotativo</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="nivelExperiencia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nivel de Experiencia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un nivel" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="intermedio">Intermedio</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            </>
        )}

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Guardando..." : "Crear Usuario"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
