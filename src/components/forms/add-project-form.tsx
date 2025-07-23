import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const addProjectFormSchema = z.object({
    projectName: z.string().min(3, 'Project name must be at least 3 characters long'),
    visibility: z.enum(['private', 'public']),
});

export type AddProjectFormSchema = z.infer<typeof addProjectFormSchema>;

export default function AddProjectForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (values: AddProjectFormSchema) => void;
    onCancel: () => void;
}) {
    const [isSubmitting] = useState(false);

    const form = useForm<AddProjectFormSchema>({
        resolver: zodResolver(addProjectFormSchema),
    });

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Project Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="projectName"
                                        placeholder="Enter project name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid gap-2">
                        <Label>Visibility</Label>
                        <Select {...form.register('visibility')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private">Private</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
