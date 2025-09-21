// src/ai/flows/adjust-itinerary-for-real-time-events.ts
'use server';
/**
 * @fileOverview Adjusts the itinerary dynamically based on real-time events like weather or delays.
 *
 * - adjustItineraryForRealTimeEvents - A function that handles the itinerary adjustment process.
 * - AdjustItineraryForRealTimeEventsInput - The input type for the adjustItineraryForRealTimeEvents function.
 * - AdjustItineraryForRealTimeEventsOutput - The return type for the adjustItineraryForRealTimeEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustItineraryForRealTimeEventsInputSchema = z.object({
  originalItinerary: z.string().describe('The original itinerary in a string format.'),
  currentWeather: z.string().describe('Current weather conditions at the location.'),
  delayInfo: z.string().describe('Information about any delays in transportation or events.'),
});
export type AdjustItineraryForRealTimeEventsInput = z.infer<typeof AdjustItineraryForRealTimeEventsInputSchema>;

const AdjustItineraryForRealTimeEventsOutputSchema = z.object({
  adjustedItinerary: z.string().describe('The adjusted itinerary based on the real-time events.'),
  reasoning: z.string().describe('The reasoning behind the adjustments made to the itinerary.'),
});
export type AdjustItineraryForRealTimeEventsOutput = z.infer<typeof AdjustItineraryForRealTimeEventsOutputSchema>;

export async function adjustItineraryForRealTimeEvents(input: AdjustItineraryForRealTimeEventsInput): Promise<AdjustItineraryForRealTimeEventsOutput> {
  return adjustItineraryForRealTimeEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustItineraryForRealTimeEventsPrompt',
  input: {schema: AdjustItineraryForRealTimeEventsInputSchema},
  output: {schema: AdjustItineraryForRealTimeEventsOutputSchema},
  prompt: `You are an AI travel assistant that adjusts itineraries based on real-time events.

  Original Itinerary: {{{originalItinerary}}}
  Current Weather: {{{currentWeather}}}
  Delay Information: {{{delayInfo}}}

  Based on the real-time events provided, adjust the itinerary to provide the user with the best possible experience. Explain your reasoning for the adjustments you have made.
  Return the adjusted itinerary and reasoning in the output schema format.
  `,
});

const adjustItineraryForRealTimeEventsFlow = ai.defineFlow(
  {
    name: 'adjustItineraryForRealTimeEventsFlow',
    inputSchema: AdjustItineraryForRealTimeEventsInputSchema,
    outputSchema: AdjustItineraryForRealTimeEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
