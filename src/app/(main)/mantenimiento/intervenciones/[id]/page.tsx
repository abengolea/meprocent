'use client';

import { useParams } from 'next/navigation';
import { InterventionDetailContent } from '@/components/interventions/intervention-detail-content';

export default function MantenimientoIntervencionDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return null;

  return <InterventionDetailContent id={id} basePath="/mantenimiento/intervenciones" />;
}
