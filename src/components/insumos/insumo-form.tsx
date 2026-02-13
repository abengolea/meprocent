'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Insumo } from '@/lib/types';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';

const insumoFormSchema = z.object({
  internalCode: z.string().min(2, 'Código interno requerido.'),
  type: z.enum(['chemical', 'material', 'spare_part']),
  name: z.string().min(3, 'Nombre requerido.'),
  activeIngredient: z.string().optional(),
  registration: z.string().optional(),
  toxicity: z.string().optional(),
  msdsUrl: z.string().url().optional().or(z.literal('')),
});

type InsumoFormValues = z.infer<typeof insumoFormSchema>;

interface InsumoFormProps {
  insumo?: Insumo;
}

export function InsumoForm({ insumo }: InsumoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const { profile } = useUser();
  const [loading, setLoading] = useState(false);
  const isEditMode = !!insumo;

  const form = useForm<InsumoFormValues>({
    resolver: zodResolver(insumoFormSchema),
    defaultValues: isEditMode ? {
      internalCode: insumo.internalCode,
      type: insumo.type,
      name: insumo.name,
      activeIngredient: insumo.activeIngredient ?? '',
      registration: insumo.registration ?? '',
      toxicity: insumo.toxicity ?? '',
      msdsUrl: insumo.msdsUrl ?? '',
    } : {
      internalCode: '',
      type: 'chemical',
      name: '',
      activeIngredient: '',
      registration: '',
      toxicity: '',
      msdsUrl: '',
    },
  });

  async function onSubmit(data: InsumoFormValues) {
    if (!db || !profile) {
      toast({ variant: 'destructive', title: 'Error', description: 'Debe iniciar sesión.' });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        internalCode: data.internalCode.trim().toUpperCase(),
        type: data.type,
        name: data.name.trim(),
        empresaId: profile.empresaId,
        ...(data.activeIngredient && { activeIngredient: data.activeIngredient.trim() }),
        ...(data.registration && { registration: data.registration.trim() }),
        ...(data.toxicity && { toxicity: data.toxicity.trim() }),
        ...(data.msdsUrl && data.msdsUrl.startsWith('http') && { msdsUrl: data.msdsUrl.trim() }),
      };

      if (isEditMode && insumo.id) {
        await updateDoc(doc(db, 'insumos', insumo.id), payload);
        toast({ title: 'Insumo actualizado', description: `${data.name} ha sido actualizado.` });
        router.push('/insumos');
      } else {
        await addDoc(collection(db, 'insumos'), payload);
        toast({ title: 'Insumo creado', description: `${data.name} ha sido agregado al catálogo.` });
        router.push('/insumos');
      }
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'No se pudo guardar.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="internalCode" render={({ field }) => (
            <FormItem>
              <FormLabel>Código interno</FormLabel>
              <FormControl><Input placeholder="M01, M02, ..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="chemical">Químico</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="spare_part">Repuesto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre / Denominación</FormLabel>
            <FormControl><Input placeholder="Ej: Deltametrina 2.5" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="activeIngredient" render={({ field }) => (
            <FormItem>
              <FormLabel>Ingrediente activo</FormLabel>
              <FormControl><Input placeholder="Ej: Deltametrina" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="registration" render={({ field }) => (
            <FormItem>
              <FormLabel>Registro (SENASA u otro)</FormLabel>
              <FormControl><Input placeholder="Ej: SENASA 3421" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="toxicity" render={({ field }) => (
            <FormItem>
              <FormLabel>Toxicidad</FormLabel>
              <FormControl><Input placeholder="Ej: Clase II, Clase IV" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="msdsUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>URL Ficha de Seguridad (MSDS)</FormLabel>
              <FormControl><Input placeholder="https://..." type="url" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Guardar cambios' : 'Crear insumo'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/insumos')}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
