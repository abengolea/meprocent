'use server';
/**
 * @fileOverview AI-powered intelligent maintenance scheduling flow.
 *
 * - intelligentMaintenanceScheduling - Analyzes historical maintenance data and equipment performance metrics to suggest optimal maintenance schedules and task intervals.
 * - IntelligentMaintenanceSchedulingInput - The input type for the intelligentMaintenanceScheduling function.
 * - IntelligentMaintenanceSchedulingOutput - The return type for the intelligentMaintenanceScheduling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentMaintenanceSchedulingInputSchema = z.object({
  equipmentReadings: z.string().describe('Historical equipment readings data in JSON format, including timestamps and sensor data.'),
  maintenanceHistory: z.string().describe('Maintenance history data in JSON format, including dates, tasks performed, and parts replaced.'),
  equipmentDetails: z.string().describe('Equipment details such as manufacturer, model, installation date, and specifications in JSON format.'),
  costData: z.string().describe('Cost data related to maintenance activities and equipment downtime in JSON format.'),
  failureData: z.string().describe('Failure data of similar components in JSON format')
});
export type IntelligentMaintenanceSchedulingInput = z.infer<typeof IntelligentMaintenanceSchedulingInputSchema>;

const IntelligentMaintenanceSchedulingOutputSchema = z.object({
  suggestedMaintenanceSchedule: z.string().describe('Suggested maintenance schedule with specific dates and tasks in JSON format.'),
  taskIntervalRecommendations: z.string().describe('Optimal task intervals for different maintenance activities in days.'),
  predictedDowntimeReduction: z.number().describe('Predicted percentage reduction in equipment downtime.'),
  resourceAllocationSuggestions: z.string().describe('Suggestions for optimal allocation of maintenance resources (personnel, parts) in JSON format.'),
  justification: z.string().describe('Justification for the suggested schedule and recommendations, referencing data analysis.'),
});
export type IntelligentMaintenanceSchedulingOutput = z.infer<typeof IntelligentMaintenanceSchedulingOutputSchema>;

export async function intelligentMaintenanceScheduling(input: IntelligentMaintenanceSchedulingInput): Promise<IntelligentMaintenanceSchedulingOutput> {
  return intelligentMaintenanceSchedulingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentMaintenanceSchedulingPrompt',
  input: {schema: IntelligentMaintenanceSchedulingInputSchema},
  output: {schema: IntelligentMaintenanceSchedulingOutputSchema},
  prompt: `You are an AI expert in predictive maintenance and optimizing maintenance schedules for industrial equipment. Analyze the provided equipment readings, maintenance history, equipment details, cost data, and failure data to suggest an optimized maintenance schedule and task intervals. Consider cost, downtime, and component lifespan.

Analyze the data and output the suggested maintenance schedule, task interval recommendations, predicted downtime reduction (in percentage), and resource allocation suggestions, along with a justification for the suggested schedule and recommendations.

Equipment Readings: {{{equipmentReadings}}}
Maintenance History: {{{maintenanceHistory}}}
Equipment Details: {{{equipmentDetails}}}
Cost Data: {{{costData}}}
Failure Data: {{{failureData}}}

Ensure the output is formatted as a JSON object matching the IntelligentMaintenanceSchedulingOutputSchema.
`,
});

const intelligentMaintenanceSchedulingFlow = ai.defineFlow(
  {
    name: 'intelligentMaintenanceSchedulingFlow',
    inputSchema: IntelligentMaintenanceSchedulingInputSchema,
    outputSchema: IntelligentMaintenanceSchedulingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
