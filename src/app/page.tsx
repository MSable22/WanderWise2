'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Landmark, Loader2, Moon, Mountain, Plane } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { ItineraryForm, formSchema } from '@/components/itinerary-form';
import { ItineraryDisplay } from '@/components/itinerary-display';
import { generateItineraryAction, adjustItineraryAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';
import type { AdjustItineraryForRealTimeEventsOutput } from '@/ai/flows/adjust-itinerary-for-real-time-events';

type ItineraryState = (GeneratePersonalizedItineraryOutput & { reasoning?: string }) | null;

export default function Home() {
  const [itinerary, setItinerary] = React.useState<ItineraryState>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: '',
      budget: 1000,
      interests: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setItinerary(null);
    const result = await generateItineraryAction(values);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.success) {
      setItinerary(result.success);
      toast({
        title: 'Itinerary Generated!',
        description: 'Your personalized trip plan is ready.',
      });
    }
  };
  
  const onAdjust = async (originalItinerary: string, currentWeather: string, delayInfo: string) => {
    setIsLoading(true);
    const result = await adjustItineraryAction({ originalItinerary, currentWeather, delayInfo });
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.success) {
      setItinerary({
        itinerary: result.success.adjustedItinerary,
        reasoning: result.success.reasoning,
      });
      toast({
        title: 'Itinerary Adjusted!',
        description: 'Your plan has been updated with the latest info.',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[50vh] min-h-[400px] w-full">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl font-bold md:text-6xl font-headline">
              Your Journey, Perfectly Planned
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl">
              AI-powered trip planning that crafts personalized itineraries based
              on your interests and budget.
            </p>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-xl">
                 <ItineraryForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
              </div>
            </div>
            <div className="lg:col-span-8">
               <ItineraryDisplay 
                itinerary={itinerary} 
                isLoading={isLoading}
                onAdjust={onAdjust}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
