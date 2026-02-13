'use client';

import { useState, useEffect } from 'react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Building, Bell, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDoc } from 'firebase/firestore';
import type { Empresa } from '@/lib/types';

export default function SettingsPage() {
  const { profile } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const empresaRef = db && profile?.empresaId ? doc(db, 'empresas', profile.empresaId) : null;
  const { data: empresa, loading } = useDoc<Empresa>(empresaRef);

  const [razonSocial, setRazonSocial] = useState('');
  const [nombreComercial, setNombreComercial] = useState('');

  useEffect(() => {
    if (empresa) {
      setRazonSocial(empresa.razonSocial || '');
      setNombreComercial(empresa.nombreComercial || '');
    }
  }, [empresa]);

  const handleSave = async () => {
    if (!db || !profile?.empresaId || !empresaRef) return;
    setSaving(true);
    try {
      await updateDoc(empresaRef, {
        razonSocial: razonSocial || empresa?.razonSocial,
        nombreComercial: nombreComercial || empresa?.nombreComercial,
      });
      toast({ title: 'Guardado', description: 'Configuración actualizada correctamente.' });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar.' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="p-8 text-center">Inicie sesión para acceder a la configuración.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Ajuste los parámetros operativos de su empresa.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>
              Datos identificadores de su empresa o sede.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">Razón Social</Label>
                  <Input
                    id="razonSocial"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value)}
                    placeholder="Ej: Mi Empresa S.A."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreComercial">Nombre Comercial</Label>
                  <Input
                    id="nombreComercial"
                    value={nombreComercial}
                    onChange={(e) => setNombreComercial(e.target.value)}
                    placeholder="Ej: Mi Empresa"
                  />
                </div>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones y Alarmas
            </CardTitle>
            <CardDescription>
              Configuración de alertas y notificaciones del sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Próximamente: umbrales de alarmas, notificaciones por correo y recordatorios de mantenimiento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horarios y Turnos
            </CardTitle>
            <CardDescription>
              Configuración de jornadas laborales y turnos de técnicos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Próximamente: horarios de atención, turnos de guardia y calendario laboral.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
