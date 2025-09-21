'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, FileText, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';

type ItineraryState = (GeneratePersonalizedItineraryOutput & { reasoning?: string }) | null;

interface ItineraryDisplayProps {
  itinerary: ItineraryState;
  isLoading: boolean;
  onAdjust: (originalItinerary: string, currentWeather: string, delayInfo: string) => void;
}

export function ItineraryDisplay({ itinerary, isLoading, onAdjust }: ItineraryDisplayProps) {
  const { toast } = useToast();
  const [weather, setWeather] = React.useState('');
  const [delay, setDelay] = React.useState('');

  const handleCopy = () => {
    if (itinerary?.itinerary) {
      navigator.clipboard.writeText(itinerary.itinerary);
      toast({
        title: 'Copied to clipboard!',
        description: 'You can now share your itinerary.',
      });
    }
  };
  
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(itinerary?.itinerary) {
      onAdjust(itinerary.itinerary, weather, delay);
    }
  };

  if (isLoading && !itinerary) {
    return <LoadingSkeleton />;
  }

  if (!itinerary) {
    return <Placeholder />;
  }

  return (
    <Card className="shadow-lg transition-all duration-500 animate-in fade-in-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Your Custom Itinerary
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          <Copy className="h-5 w-5" />
          <span className="sr-only">Copy Itinerary</span>
        </Button>
      </CardHeader>
      <CardContent>
        {itinerary.reasoning && (
           <Card className="mb-4 border-accent bg-accent/10">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-accent-foreground/80"><AlertTriangle className="h-5 w-5 text-accent"/>Adjustment Reason</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap font-sans text-sm">{itinerary.reasoning}</p>
            </CardContent>
           </Card>
        )}
        <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{itinerary.itinerary}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
        <h3 className="font-headline flex items-center gap-2 text-lg font-semibold">
           <Sparkles className="h-5 w-5 text-accent" />
           Real-time Adjustments
        </h3>
        <p className="text-sm text-muted-foreground">Weather changed? Flight delayed? Adjust your plan on the fly.</p>
        <form className="w-full space-y-4" onSubmit={handleAdjustSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="space-y-2">
                    <Label htmlFor="weather">Current Weather</Label>
                    <Input id="weather" value={weather} onChange={(e) => setWeather(e.target.value)} placeholder="e.g., Sunny, 25°C" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="delay">Delay Information</Label>
                    <Input id="delay" value={delay} onChange={(e) => setDelay(e.target.value)} placeholder="e.g., Flight delayed by 2 hours" />
                </div>
            </div>
          <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
            <Send className="mr-2 h-4 w-4" />
            Adjust Itinerary
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

const Placeholder = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center h-full min-h-[400px]">
    <FileText className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">Your journey awaits</h3>
    <p className="mt-2 text-sm text-muted-foreground">Fill out the form to generate your personalized travel itinerary.</p>
  </div>
);

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter>
       <Skeleton className="h-10 w-32" />
    </CardFooter>
  </Card>
);
