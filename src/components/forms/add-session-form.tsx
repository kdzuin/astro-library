'use client';

import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Loader2, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createSession } from '@/lib/server/actions/sessions';

const addSessionFormSchema = z.object({
    date: z.date('Please provide the date of the session'),
});

export type AddSessionFormSchema = z.infer<typeof addSessionFormSchema>;

export default function AddSessionForm({ projectId }: { projectId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AddSessionFormSchema>({
        resolver: zodResolver(addSessionFormSchema),
        defaultValues: {
            date: new Date(),
        },
    });

    const onSubmit = async (data: AddSessionFormSchema) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('date', format(data.date, 'yyyy-MM-dd'));

            const result = await createSession(projectId, formData);

            if (!result.success) {
                throw new Error(result.error || 'Failed to create session');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            window.location.replace(`/projects/${projectId}`);
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
                data-testid="add-session-form"
            >
                {error && (
                    <div
                        className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm"
                        data-testid="global-error-message"
                    >
                        {error}
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Date</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isLoading}
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date('1900-01-01')
                                            }
                                            captionLayout="dropdown"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage data-testid="error-message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                        data-testid="submit-button"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <PlusIcon />
                                Create Session
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => router.back()}
                        data-testid="cancel-button"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
