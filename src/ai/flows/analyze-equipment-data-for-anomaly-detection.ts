'use server';
/**
 * @fileOverview AI-powered equipment anomaly detection flow.
 *
 * - analyzeEquipmentDataForAnomalyDetection - Analyzes equipment data to predict potential failures and recommend optimal maintenance intervals.
 * - AnalyzeEquipmentDataInput - The input type for the analyzeEquipmentDataForAnomalyDetection function.
 * - AnalyzeEquipmentDataOutput - The return type for the analyzeEquipmentDataForAnomalyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEquipmentDataInputSchema = z.object({
  equipmentReadings: z.string().describe('Historical equipment readings data in JSON format.'),
  maintenanceHistory: z.string().describe('Maintenance history data in JSON format.'),
  equipmentDetails: z.string().describe('Equipment details such as manufacturer, model, and installation date in JSON format.'),
});
export type AnalyzeEquipmentDataInput = z.infer<typeof AnalyzeEquipmentDataInputSchema>;

const AnalyzeEquipmentDataOutputSchema = z.object({
  predictedFailures: z.string().describe('Predicted potential failures and anomalies in JSON format.'),
  recommendedMaintenanceInterval: z.string().describe('Recommended optimal maintenance interval in days.'),
  confidenceLevel: z.number().describe('Confidence level of the prediction (0-1).'),
});
export type AnalyzeEquipmentDataOutput = z.infer<typeof AnalyzeEquipmentDataOutputSchema>;

export async function analyzeEquipmentDataForAnomalyDetection(input: AnalyzeEquipmentDataInput): Promise<AnalyzeEquipmentDataOutput> {
  return analyzeEquipmentDataForAnomalyDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEquipmentDataForAnomalyDetectionPrompt',
  input: {schema: AnalyzeEquipmentDataInputSchema},
  output: {schema: AnalyzeEquipmentDataOutputSchema},
  prompt: `You are an AI expert in predictive maintenance for industrial equipment. Analyze the provided equipment readings, maintenance history, and equipment details to predict potential failures or anomalies and recommend an optimal interval between maintenance tasks to maximize equipment component lifespan.

Analyze the data and output the predicted failures, recommended maintenance interval in days, and a confidence level for the prediction.

Equipment Readings: {{{equipmentReadings}}}
Maintenance History: {{{maintenanceHistory}}}
Equipment Details: {{{equipmentDetails}}}

Ensure the output is formatted as a JSON object matching the AnalyzeEquipmentDataOutputSchema.
`,
});

const analyzeEquipmentDataForAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'analyzeEquipmentDataForAnomalyDetectionFlow',
    inputSchema: AnalyzeEquipmentDataInputSchema,
    outputSchema: AnalyzeEquipmentDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
