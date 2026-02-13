import type { Metadata } from 'next';
import { EquipmentDetailLoader } from '@/components/equipment/equipment-detail-loader';

export const metadata: Metadata = {
  title: 'Detalle de Equipo | MEPROCENT',
  description: 'Detalles del equipo y historial de intervenciones.',
};

export default function MantenimientoEquipoDetailPage() {
  return <EquipmentDetailLoader basePath="/mantenimiento/equipos" />;
}
