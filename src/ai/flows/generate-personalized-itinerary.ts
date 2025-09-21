// src/ai/flows/generate-personalized-itinerary.ts
'use server';

/**
 * @fileOverview Generates a personalized travel itinerary based on user preferences.
 *
 * - generatePersonalizedItinerary - A function that generates a personalized itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedItineraryInputSchema = z.object({
  budget: z.number().describe('The budget for the trip in USD.'),
  interests: z.array(z.string()).describe('A list of interests for the trip (e.g., heritage, nightlife, adventure).'),
  travelDates: z.string().describe('The start and end dates for the trip (e.g., 2024-01-01 to 2024-01-10).'),
  region: z.string().describe('The region or country for the trip (e.g., India, France).'),
});

export type GeneratePersonalizedItineraryInput = z.infer<typeof GeneratePersonalizedItineraryInputSchema>;

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed travel itinerary including destinations, activities, and estimated costs.'),
});

export type GeneratePersonalizedItineraryOutput = z.infer<typeof GeneratePersonalizedItineraryOutputSchema>;

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: {schema: GeneratePersonalizedItineraryInputSchema},
  output: {schema: GeneratePersonalizedItineraryOutputSchema},
  prompt: `You are a travel agent specializing in personalized itinerary generation.

  Based on the user's budget, interests, travel dates and desired region, create a detailed day-by-day travel itinerary.
  Include suggested destinations, activities, estimated costs and travel times. 
  Make sure the itinerary is feasible, well-balanced, and takes into account local conditions.

  Budget: {{budget}} USD
  Interests: {{interests}}
  Travel Dates: {{travelDates}}
  Region: {{region}}

  Itinerary: `,
});

const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedItineraryFlow',
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
