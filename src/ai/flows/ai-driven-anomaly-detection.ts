'use server';
/**
 * @fileOverview AI-powered equipment anomaly detection flow.
 *
 * - aiDrivenAnomalyDetection - Analyzes equipment data to predict potential failures and recommend optimal maintenance intervals.
 * - AiDrivenAnomalyDetectionInput - The input type for the aiDrivenAnomalyDetection function.
 * - AiDrivenAnomalyDetectionOutput - The return type for the aiDrivenAnomalyDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDrivenAnomalyDetectionInputSchema = z.object({
  equipmentReadings: z.string().describe('Historical equipment readings data in JSON format.'),
  maintenanceHistory: z.string().describe('Maintenance history data in JSON format.'),
  equipmentDetails: z.string().describe('Equipment details such as manufacturer, model, and installation date in JSON format.'),
});
export type AiDrivenAnomalyDetectionInput = z.infer<typeof AiDrivenAnomalyDetectionInputSchema>;

const AiDrivenAnomalyDetectionOutputSchema = z.object({
  predictedFailures: z.string().describe('Predicted potential failures and anomalies in JSON format.'),
  recommendedMaintenanceInterval: z.string().describe('Recommended optimal maintenance interval in days.'),
  confidenceLevel: z.number().describe('Confidence level of the prediction (0-1).'),
});
export type AiDrivenAnomalyDetectionOutput = z.infer<typeof AiDrivenAnomalyDetectionOutputSchema>;

export async function aiDrivenAnomalyDetection(input: AiDrivenAnomalyDetectionInput): Promise<AiDrivenAnomalyDetectionOutput> {
  return aiDrivenAnomalyDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDrivenAnomalyDetectionPrompt',
  input: {schema: AiDrivenAnomalyDetectionInputSchema},
  output: {schema: AiDrivenAnomalyDetectionOutputSchema},
  prompt: `You are an AI expert in predictive maintenance for industrial equipment. Analyze the provided equipment readings, maintenance history, and equipment details to predict potential failures or anomalies and recommend an optimal interval between maintenance tasks to maximize equipment component lifespan.\n\nAnalyze the data and output the predicted failures, recommended maintenance interval in days, and a confidence level for the prediction.\n\nEquipment Readings: {{{equipmentReadings}}}\nMaintenance History: {{{maintenanceHistory}}}\nEquipment Details: {{{equipmentDetails}}}\n\nEnsure the output is formatted as a JSON object matching the AiDrivenAnomalyDetectionOutputSchema.\n`,
});

const aiDrivenAnomalyDetectionFlow = ai.defineFlow(
  {
    name: 'aiDrivenAnomalyDetectionFlow',
    inputSchema: AiDrivenAnomalyDetectionInputSchema,
    outputSchema: AiDrivenAnomalyDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
