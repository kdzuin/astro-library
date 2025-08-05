'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Loader2, PlusIcon } from 'lucide-react';
import { tagsStringToArray } from '@/lib/utils';

const addProjectFormSchema = z.object({
    name: z
        .string('Please provide the name of the project, that would be used as a title')
        .min(3, 'Project name must be at least 3 characters long'),
    description: z.string().optional(),
    visibility: z.enum(['private', 'public']),
    tags: z.string().optional(), // Comma-separated tags
});

export type AddProjectFormSchema = z.infer<typeof addProjectFormSchema>;

export default function AddProjectForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AddProjectFormSchema>({
        resolver: zodResolver(addProjectFormSchema),
        defaultValues: {
            visibility: 'private',
            description: '',
            tags: '',
        },
    });

    const onSubmit = async (data: AddProjectFormSchema) => {
        setIsLoading(true);
        setError(null);

        try {
            // Transform form data to match API schema
            const projectData = {
                name: data.name,
                description: data.description || '',
                visibility: data.visibility,
                tags: tagsStringToArray(data.tags),
                status: 'planning' as const,
                sessions: {},
                processingNotes: '',
                processingImageUrls: [],
                finalImageUrls: [],
                collectionIds: [],
            };

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            await response.json();

            // Navigate back and refresh to show the new project
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            window.location.replace('/projects');
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
                data-testid="add-project-form"
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
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. NGC7000 — North America Nebula"
                                    disabled={isLoading}
                                    data-testid="project-name-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage data-testid="error-message" />
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
                                    placeholder="Describe your project, target details, goals, etc."
                                    disabled={isLoading}
                                    data-testid="project-description-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage data-testid="error-message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. nebula, emission, summer, widefield (comma-separated)"
                                    disabled={isLoading}
                                    data-testid="project-tags-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage data-testid="error-message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Visibility</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isLoading}
                                    data-testid="project-visibility-select"
                                >
                                    <SelectTrigger
                                        className="w-full"
                                        data-testid="project-visibility-trigger"
                                    >
                                        <SelectValue placeholder="Select visibility" />
                                    </SelectTrigger>
                                    <SelectContent data-testid="project-visibility-content">
                                        <SelectItem
                                            value="private"
                                            data-testid="visibility-private"
                                        >
                                            Private - Only you can see this project
                                        </SelectItem>
                                        <SelectItem value="public" data-testid="visibility-public">
                                            Public - Anyone can view this project
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
                                Create Project
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
