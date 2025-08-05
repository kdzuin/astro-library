'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Loader2 } from 'lucide-react';

const addSessionFormSchema = z.object({
    name: z
        .string('Please provide the name of the session, that would be used as a title')
        .min(3, 'Session name must be at least 3 characters long'),
});

export type AddSessionFormSchema = z.infer<typeof addSessionFormSchema>;

export default function AddSessionForm({ projectId }: { projectId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AddSessionFormSchema>({
        resolver: zodResolver(addSessionFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: AddSessionFormSchema) => {
        setIsLoading(true);
        setError(null);

        console.log(data);
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Name / Date</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="2025-04-01"
                                    disabled={isLoading}
                                    data-testid="session-name-input"
                                    {...field}
                                />
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
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Creating...' : 'Create Session'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => router.push(`/projects/${projectId}`)}
                        data-testid="cancel-button"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
