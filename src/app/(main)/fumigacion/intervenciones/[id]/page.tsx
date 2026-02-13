'use client';

import { useParams } from 'next/navigation';
import { InterventionDetailContent } from '@/components/interventions/intervention-detail-content';

export default function FumigacionIntervencionDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) return null;

  return <InterventionDetailContent id={id} basePath="/fumigacion/intervenciones" />;
}
