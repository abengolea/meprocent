'use client';

import { useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Intervencion, Equipo, Alarma } from '@/lib/types';

const chartConfig = {
  Intervenciones: { label: 'Intervenciones', color: 'hsl(var(--chart-1))' },
  correctivo: { label: 'Correctivo', color: 'hsl(var(--chart-2))' },
  preventivo: { label: 'Preventivo', color: 'hsl(var(--chart-3))' },
  inspeccion: { label: 'Inspección', color: 'hsl(var(--chart-4))' },
  desinsectacion: { label: 'Desinsectación', color: 'hsl(var(--chart-5))' },
};

export default function ReportsPage() {
  const { profile } = useUser();
  const db = useFirestore();

  const intervencionesQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') {
      return query(collection(db, 'intervenciones'), orderBy('fechaInicio', 'desc'));
    }
    return query(
      collection(db, 'intervenciones'),
      where('empresaId', '==', profile.empresaId),
      orderBy('fechaInicio', 'desc')
    );
  }, [db, profile]);

  const equiposQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') return query(collection(db, 'equipos'));
    return query(collection(db, 'equipos'), where('empresaId', '==', profile.empresaId));
  }, [db, profile]);

  const alarmasQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') return query(collection(db, 'alarmas'));
    return query(collection(db, 'alarmas'), where('empresaId', '==', profile.empresaId));
  }, [db, profile]);

  const { data: intervenciones } = useCollection<Intervencion>(intervencionesQuery);
  const { data: equipos } = useCollection<Equipo>(equiposQuery);
  const { data: alarmas } = useCollection<Alarma>(alarmasQuery);

  const toDate = (d: unknown) => {
    if (!d) return new Date(0);
    if (typeof d === 'object' && d !== null && 'toMillis' in d) {
      return new Date((d as { toMillis: () => number }).toMillis());
    }
    return new Date(d as Date);
  };

  const dataPorMes = useMemo(() => {
    if (!intervenciones?.length) return [];
    const now = new Date();
    const meses: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const m = startOfMonth(new Date(now.getFullYear(), now.getMonth() - i, 1));
      meses[format(m, 'MMM yyyy', { locale: es })] = 0;
    }
    intervenciones.forEach((i) => {
      const fecha = toDate(i.fechaInicio);
      const key = format(startOfMonth(fecha), 'MMM yyyy', { locale: es });
      if (meses[key] !== undefined) meses[key]++;
    });
    return Object.entries(meses).map(([name, Intervenciones]) => ({ name, Intervenciones }));
  }, [intervenciones]);

  const dataPorTipo = useMemo(() => {
    if (!intervenciones?.length) return [];
    const counts: Record<string, number> = {};
    intervenciones.forEach((i) => {
      const t = i.tipoIntervencion || 'otro';
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [intervenciones]);

  const estadoEquipos = useMemo(() => {
    if (!equipos?.length) return [];
    const counts: Record<string, number> = {};
    equipos.forEach((e) => {
      const s = e.estadoActual || 'operativo';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [equipos]);

  const alarmasActivas = useMemo(
    () => alarmas?.filter((a) => a.estado === 'pendiente' || a.estado === 'en_progreso').length ?? 0,
    [alarmas]
  );

  if (!profile) {
    return <div className="p-8 text-center">Inicie sesión para ver los reportes.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes y Analíticas</h1>
        <p className="text-muted-foreground">
          Visualice el rendimiento y los datos clave de sus operaciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Equipos</CardDescription>
            <CardTitle className="text-3xl">{equipos?.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Intervenciones (registradas)</CardDescription>
            <CardTitle className="text-3xl">{intervenciones?.length ?? 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alarmas Activas</CardDescription>
            <CardTitle className="text-3xl">{alarmasActivas}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Equipos Operativos</CardDescription>
            <CardTitle className="text-3xl">
              {equipos?.filter((e) => e.estadoActual === 'operativo').length ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Intervenciones por Mes</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={dataPorMes}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Intervenciones" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenciones por Tipo</CardTitle>
            <CardDescription>Distribución por tipo de servicio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={dataPorTipo} layout="vertical" margin={{ left: 60 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Equipos</CardTitle>
            <CardDescription>Distribución por estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={estadoEquipos}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
            <CardDescription>Datos clave del período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Equipos fuera de servicio</span>
              <span className="font-medium">
                {equipos?.filter((e) => e.estadoActual === 'fuera_de_servicio').length ?? 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">En mantenimiento</span>
              <span className="font-medium">
                {equipos?.filter((e) => e.estadoActual === 'en_mantenimiento').length ?? 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Alarmas resueltas</span>
              <span className="font-medium">
                {alarmas?.filter((a) => a.estado === 'resuelta').length ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
