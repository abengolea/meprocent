"use client";

import * as React from "react";
import { analyzeEquipmentDataForAnomalyDetection } from "@/ai/flows/analyze-equipment-data-for-anomaly-detection";
import type { AnalyzeEquipmentDataOutput } from "@/ai/flows/analyze-equipment-data-for-anomaly-detection";
import { getIntervencionesByEquipoId, getLecturasByEquipoId } from "@/lib/mock-data";
import { Equipo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot, Loader2, BarChart, FileWarning, CalendarCheck } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from "recharts"

async function runAnalysis(equipmentId: string, equipmentDetails: Equipo) {
  const maintenanceHistory = await getIntervencionesByEquipoId(equipmentId);
  const equipmentReadings = await getLecturasByEquipoId(equipmentId);

  const result = await analyzeEquipmentDataForAnomalyDetection({
    equipmentDetails: JSON.stringify(equipmentDetails),
    maintenanceHistory: JSON.stringify(maintenanceHistory),
    equipmentReadings: JSON.stringify(equipmentReadings),
  });

  return result;
}

type PredictedFailure = {
  componente: string;
  tipo_falla: string;
  causa_probable: string;
  criticidad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
};

export function AnomalyDetectionClient({ equipment }: { equipment: Equipo }) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeEquipmentDataOutput | null>(null);
  const [parsedFailures, setParsedFailures] = React.useState<PredictedFailure[]>([]);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setParsedFailures([]);

    try {
      // For development, we'll use a mock result to avoid constant API calls
      // In production, you would use the actual `runAnalysis` function.
      // const result = await runAnalysis(equipment.id, equipment);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      const result: AnalyzeEquipmentDataOutput = {
          predictedFailures: JSON.stringify([
              { componente: "Rodamientos del motor", tipo_falla: "Desgaste acelerado", causa_probable: "Vibraciones anómalas detectadas en el último período", criticidad: "Alta" },
              { componente: "Bobinado", tipo_falla: "Sobrecalentamiento", causa_probable: "Picos de temperatura registrados", criticidad: "Media" }
          ]),
          recommendedMaintenanceInterval: "25",
          confidenceLevel: 0.85
      }

      setAnalysisResult(result);

      try {
        const failures = JSON.parse(result.predictedFailures);
        setParsedFailures(Array.isArray(failures) ? failures : []);
      } catch (e) {
        console.error("Failed to parse predicted failures:", e);
        toast({
            variant: "destructive",
            title: "Error de Análisis",
            description: "El formato de fallas predichas no es válido.",
        });
      }

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Error de Análisis",
        description: "No se pudo completar el análisis. Intente de nuevo.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getCriticidadColor = (criticidad: PredictedFailure['criticidad']) => {
    switch(criticidad) {
        case 'Crítica': return 'text-red-500';
        case 'Alta': return 'text-orange-500';
        case 'Media': return 'text-yellow-500';
        case 'Baja': return 'text-blue-500';
    }
  }
  
  const confidenceData = [{
    name: "Confianza",
    value: analysisResult ? Math.round(analysisResult.confidenceLevel * 100) : 0,
    fill: "hsl(var(--primary))",
  }];

  const chartConfig: ChartConfig = {
    value: {
      label: "Confianza",
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Análisis</CardTitle>
          <CardDescription>
            Presione el botón para comenzar el análisis de datos históricos y predictivos para este equipo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El proceso puede tardar unos momentos mientras la IA procesa las lecturas del equipo, el historial de mantenimiento y los detalles del mismo para generar las predicciones.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Analizar Datos con IA
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-semibold">Procesando datos...</p>
            <p className="text-sm text-muted-foreground text-center">La IA está analizando miles de puntos de datos para encontrar patrones.</p>
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileWarning className="w-5 h-5 text-orange-500" /> Fallas Potenciales Predichas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {parsedFailures.length > 0 ? (
                        <ul className="space-y-4">
                            {parsedFailures.map((failure, index) => (
                            <li key={index} className="p-4 bg-muted/50 rounded-lg">
                                <p className="font-semibold">{failure.componente}: <span className="font-normal">{failure.tipo_falla}</span></p>
                                <p className="text-sm text-muted-foreground mt-1">{failure.causa_probable}</p>
                                <p className={`text-sm font-bold mt-2 ${getCriticidadColor(failure.criticidad)}`}>Criticidad: {failure.criticidad}</p>
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-sm text-muted-foreground">No se predijeron fallas inminentes.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarCheck className="w-5 h-5 text-green-500"/> Recomendación</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">Intervalo de Mantenimiento Óptimo</p>
                        <p className="text-4xl font-bold my-2">{analysisResult.recommendedMaintenanceInterval} <span className="text-lg font-medium">días</span></p>
                        <p className="text-xs text-muted-foreground">Basado en el análisis predictivo para maximizar la vida útil del componente.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5 text-primary"/> Nivel de Confianza</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px] w-full">
                            <RechartsBarChart accessibilityLayer data={confidenceData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                <XAxis type="number" dataKey="value" hide domain={[0, 100]} />
                                <YAxis type="category" dataKey="name" hide />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Bar dataKey="value" radius={5} background={{ fill: 'hsl(var(--muted))', radius: 5 }}>
                                </Bar>
                            </RechartsBarChart>
                        </ChartContainer>
                        <p className="text-center font-bold text-2xl mt-2">{Math.round(analysisResult.confidenceLevel * 100)}%</p>
                        <p className="text-center text-sm text-muted-foreground">Confianza en la predicción</p>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
