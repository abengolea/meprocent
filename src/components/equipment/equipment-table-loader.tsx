'use client';

import { useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { EquipmentTable } from './equipment-table';
import { EquipmentTableSkeleton } from './equipment-table-skeleton';
import type { Equipo } from '@/lib/types';

const TIPOS_MANTENIMIENTO = ['motor', 'bomba', 'tablero_electrico', 'ups', 'transformador', 'otro'];
const TIPOS_FUMIGACION = ['trampa', 'cebadera'];

interface EquipmentTableLoaderProps {
  status?: Equipo['estadoActual'];
  vertical?: 'maintenance' | 'pest_control';
}

export function EquipmentTableLoader({ status, vertical }: EquipmentTableLoaderProps) {
  const { profile, loading: userLoading } = useUser();
  const db = useFirestore();

  const equiposQuery = useMemo(() => {
    if (!db || !profile) return null;
    if (profile.role === 'super_admin') {
      return query(collection(db, 'equipos'));
    }
    return query(collection(db, 'equipos'), where('empresaId', '==', profile.empresaId));
  }, [db, profile]);

  const { data: equipos, loading: dataLoading } = useCollection<Equipo>(equiposQuery);

  if (userLoading || dataLoading) {
    return <EquipmentTableSkeleton />;
  }

  if (!profile) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Inicie sesión para ver los equipos.
      </div>
    );
  }

  let filtered = equipos ?? [];
  if (status) {
    filtered = filtered.filter((e) => e.estadoActual === status);
  }
  if (vertical === 'maintenance') {
    filtered = filtered.filter((e) => TIPOS_MANTENIMIENTO.includes(e.tipoEquipo));
  } else if (vertical === 'pest_control') {
    filtered = filtered.filter((e) => TIPOS_FUMIGACION.includes(e.tipoEquipo));
  }

  return <EquipmentTable equipos={filtered} basePath={vertical === 'maintenance' ? '/mantenimiento/equipos' : vertical === 'pest_control' ? '/fumigacion/equipos' : '/equipos'} />;
}
