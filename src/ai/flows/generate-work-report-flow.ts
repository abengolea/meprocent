
'use server';
/**
 * @fileOverview Flujo de IA para asistir en la redacción de informes de trabajo.
 *
 * - generateWorkReport - Genera texto detallado para informes a partir de palabras clave.
 * - GenerateWorkReportInput - Tipo de entrada para la función.
 * - GenerateWorkReportOutput - Tipo de salida para la función.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Equipo } from '@/lib/types'; // Asumimos que los tipos están disponibles

// Usamos z.any() para el equipo para simplificar, pero un esquema Zod sería mejor en producción
const GenerateWorkReportInputSchema = z.object({
  keywords: z.string().describe('Las palabras clave o el texto inicial ingresado por el técnico.'),
  fieldType: z.enum(['problemaDetectado', 'trabajoRealizado', 'observaciones']).describe('El campo específico del formulario para el que se genera el texto.'),
  equipment: z.any().describe('El objeto completo del equipo en el que se está trabajando.'),
});
export type GenerateWorkReportInput = z.infer<typeof GenerateWorkReportInputSchema>;

const GenerateWorkReportOutputSchema = z.object({
  generatedText: z.string().describe('El texto completo y mejorado para el informe.'),
});
export type GenerateWorkReportOutput = z.infer<typeof GenerateWorkReportOutputSchema>;

export async function generateWorkReport(input: GenerateWorkReportInput): Promise<GenerateWorkReportOutput> {
  return generateWorkReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkReportPrompt',
  input: { schema: GenerateWorkReportInputSchema },
  output: { schema: GenerateWorkReportOutputSchema },
  prompt: `
    Eres un asistente de IA para técnicos de mantenimiento industrial, experto en redactar informes claros y profesionales.
    Un técnico te ha proporcionado palabras clave sobre un trabajo de mantenimiento.
    Tu tarea es expandir esas palabras clave en un texto detallado y bien redactado para un informe oficial.

    **Contexto del Trabajo:**
    - **Equipo:** {{JSON.stringify equipment}}
    - **Campo a completar:** {{{fieldType}}}
    - **Palabras clave del técnico:** {{{keywords}}}

    **Instrucciones:**
    1.  **Analiza el Campo a Completar ({{{fieldType}}}):**
        *   Si es 'problemaDetectado', enfócate en describir la falla o síntoma de manera técnica. Incluye posibles causas si se pueden inferir.
        *   Si es 'trabajoRealizado', describe los pasos de la reparación de forma secuencial y profesional. Usa un lenguaje técnico preciso.
        *   Si es 'observaciones', redacta recomendaciones, notas de seguimiento o advertencias de seguridad.
    2.  **Usa los detalles del equipo ({{JSON.stringify equipment}}) para dar contexto.** Menciona componentes específicos del equipo si es relevante.
    3.  **Expande las palabras clave ({{{keywords}}})** en oraciones completas y párrafos coherentes. No te limites a repetir las palabras, sino a interpretar y detallar la idea.
    4.  **Adopta un tono profesional y técnico.** Evita lenguaje coloquial.
    5.  **NO inventes información que no pueda deducirse** de las palabras clave o los detalles del equipo.
    6.  El resultado debe ser únicamente el texto generado para el campo del informe.

    **Ejemplo:**
    - **Equipo:** { descripcion: 'Motor de cinta transportadora', tipo: 'motor' }
    - **Campo:** 'problemaDetectado'
    - **Palabras clave:** "ruido fuerte rodamientos, vibra mucho"
    - **Texto Generado Esperado:** "Se detecta un ruido anómalo y vibraciones excesivas provenientes de la zona de rodamientos del motor. La inspección auditiva sugiere un posible desgaste avanzado o fallo inminente de los rodamientos del eje principal, lo cual está causando la vibración en toda la carcasa del motor."

    Ahora, genera el texto para el caso proporcionado.
  `,
});

const generateWorkReportFlow = ai.defineFlow(
  {
    name: 'generateWorkReportFlow',
    inputSchema: GenerateWorkReportInputSchema,
    outputSchema: GenerateWorkReportOutputSchema,
  },
  async (input) => {
    // Añadimos manejo de errores por si la IA no devuelve una salida válida
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error('La respuesta de la IA no contiene una salida válida.');
      }
      return output;
    } catch (e) {
      console.error('Error en el flujo de Genkit:', e);
      // Devolvemos las palabras clave originales si la IA falla.
      return { generatedText: input.keywords };
    }
  }
);

    