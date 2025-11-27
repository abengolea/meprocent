import { getEquipoById } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { AnomalyDetectionClient } from "@/components/ai/anomaly-detection-client";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const equipo = await getEquipoById(params.id);
  if (!equipo) return { title: "Análisis IA" };
  return {
    title: `Análisis IA: ${equipo.codigoInterno} | MaintWise`,
    description: `Análisis predictivo con IA para el equipo ${equipo.descripcion}.`,
  };
}

export default async function AnalysisPage({ params }: Props) {
  const equipo = await getEquipoById(params.id);

  if (!equipo) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Análisis Predictivo con IA</h1>
        <p className="text-muted-foreground">
          Analizando equipo: <span className="font-semibold text-foreground">{equipo.descripcion} ({equipo.codigoInterno})</span>
        </p>
      </header>
      <AnomalyDetectionClient equipment={equipo} />
    </div>
  );
}
