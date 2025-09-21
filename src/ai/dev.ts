import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-itinerary.ts';
import '@/ai/flows/adjust-itinerary-for-real-time-events.ts';