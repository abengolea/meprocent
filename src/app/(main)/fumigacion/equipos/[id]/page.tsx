import type { Metadata } from 'next';
import { EquipmentDetailLoader } from '@/components/equipment/equipment-detail-loader';

export const metadata: Metadata = {
  title: 'Detalle de Equipo | MEPROCENT',
  description: 'Detalles del equipo de fumigación y historial de intervenciones.',
};

export default function FumigacionEquipoDetailPage() {
  return <EquipmentDetailLoader basePath="/fumigacion/equipos" />;
}
