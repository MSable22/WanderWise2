'use client';

import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';
import { CalendarIcon, DollarSign, Landmark, Loader2, MapPin, Moon, Mountain, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePickerWithRange } from '@/components/ui/date-picker';

export const formSchema = z.object({
  region: z.string().min(2, {
    message: 'Region must be at least 2 characters.',
  }),
  budget: z.coerce.number().positive({
    message: 'Budget must be a positive number.',
  }),
  travelDates: z.object(
    {
      from: z.date({ required_error: 'A start date is required.' }),
      to: z.date({ required_error: 'An end date is required.' }),
    },
    { required_error: 'Please select a date range.' }
  ),
  interests: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one interest.',
  }),
});

const interests = [
  { id: 'heritage', label: 'Heritage', icon: Landmark },
  { id: 'nightlife', label: 'Nightlife', icon: Moon },
  { id: 'adventure', label: 'Adventure', icon: Mountain },
];

interface ItineraryFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export function ItineraryForm({ form, onSubmit, isLoading }: ItineraryFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          Plan Your Next Adventure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Destination (Region/Country)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., India, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Budget (in USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelDates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Travel Dates</FormLabel>
                  <DatePickerWithRange
                    date={field.value}
                    onDateChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Interests</FormLabel>
                    <FormDescription>
                      Select what you'd love to do.
                    </FormDescription>
                  </div>
                  {interests.map((interest) => (
                    <FormField
                      key={interest.id}
                      control={form.control}
                      name="interests"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={interest.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, interest.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== interest.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <interest.icon className="h-4 w-4 text-muted-foreground"/> {interest.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
