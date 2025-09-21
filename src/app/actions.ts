'use server';

import { z } from 'zod';
import {
  generatePersonalizedItinerary,
  GeneratePersonalizedItineraryInput,
} from '@/ai/flows/generate-personalized-itinerary';
import {
  adjustItineraryForRealTimeEvents,
  AdjustItineraryForRealTimeEventsInput,
} from '@/ai/flows/adjust-itinerary-for-real-time-events';
import { formSchema } from '@/components/itinerary-form';


export async function generateItineraryAction(values: z.infer<typeof formSchema>) {
  const validatedFields = formSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  const { region, budget, travelDates, interests } = validatedFields.data;

  const input: GeneratePersonalizedItineraryInput = {
    region,
    budget,
    interests,
    travelDates: `${travelDates.from.toISOString().split('T')[0]} to ${travelDates.to.toISOString().split('T')[0]}`,
  };

  try {
    const result = await generatePersonalizedItinerary(input);
    return { success: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate itinerary. Please try again.' };
  }
}

export async function adjustItineraryAction(input: AdjustItineraryForRealTimeEventsInput) {
    if (!input.originalItinerary) {
        return { error: 'Original itinerary is missing.' };
    }
     if (!input.currentWeather && !input.delayInfo) {
        return { error: 'Please provide weather or delay information for adjustment.' };
    }
    
    try {
        const result = await adjustItineraryForRealTimeEvents(input);
        return { success: result };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to adjust itinerary. Please try again.' };
    }
}
