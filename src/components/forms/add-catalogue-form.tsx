'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const addCatalogueFormSchema = z.object({
    name: z.string().min(3, 'Catalogue name must be at least 3 characters long'),
    description: z.string().optional(),
    abbreviation: z
        .string()
        .min(1, 'Abbreviation is required')
        .max(10, 'Abbreviation must be 10 characters or less'),
    prefix: z.string().optional(),
});

export type AddCatalogueFormSchema = z.infer<typeof addCatalogueFormSchema>;

export default function AddCatalogueForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AddCatalogueFormSchema>({
        resolver: zodResolver(addCatalogueFormSchema),
        defaultValues: {
            name: '',
            description: '',
            abbreviation: '',
            prefix: '',
        },
    });

    const onSubmit = async (data: AddCatalogueFormSchema) => {
        setIsLoading(true);
        setError(null);

        try {
            // Transform form data to match API schema
            const catalogueData = {
                name: data.name,
                description: data.description || '',
                abbreviation: data.abbreviation,
                prefix: data.prefix || '',
                type: 'user' as const,
                objectCount: 0,
            };

            const response = await fetch('/api/catalogues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(catalogueData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create catalogue');
            }

            await response.json();

            // Navigate to catalogues list
            router.push('/catalogues');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catalogue Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. My Deep Sky Objects"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="abbreviation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Abbreviation</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. MDSO, KDZ, etc."
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Object Prefix (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. MDSO, KDZ (for object designations like MDSO-1, KDZ-42)"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe the purpose and contents of this catalogue..."
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Creating...' : 'Create Catalogue'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => router.push('/catalogues')}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}
