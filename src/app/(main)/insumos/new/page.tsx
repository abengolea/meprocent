import type { Metadata } from 'next';
import { InsumoForm } from '@/components/insumos/insumo-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Nuevo Insumo | MEPROCENT',
  description: 'Agregar producto químico o material al catálogo.',
};

export default function NewInsumoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nuevo Insumo</h1>
        <p className="text-muted-foreground">
          Registre productos químicos, materiales o repuestos para usar en intervenciones.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Datos del Insumo</CardTitle>
          <CardDescription>
            Complete la información del producto. Los campos de ingrediente activo y registro son obligatorios para químicos según normativa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InsumoForm />
        </CardContent>
      </Card>
    </div>
  );
}
