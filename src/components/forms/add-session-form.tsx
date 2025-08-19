'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { CalendarIcon, Loader2, PlusIcon, Trash2Icon } from 'lucide-react';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createSession } from '@/lib/server/actions/sessions';

const acquisitionDetailsSchema = z.object({
    filter: z.string().min(1, 'Filter is required'),
    subframes: z.number().min(1, 'Number of subframes must be at least 1').optional(),
    exposurePerSubframe: z.number().optional(),
});

const addSessionFormSchema = z.object({
    date: z.date('Please provide the date of the session'),
    acquisitionDetails: z.array(acquisitionDetailsSchema),
});

export type AddSessionFormSchema = z.infer<typeof addSessionFormSchema>;

const filterOptions = [
    'Luminance',
    'Red',
    'Green',
    'Blue',
    'Ha',
    'OIII',
    'SII',
    'NII',
    'Hb',
    'Clear',
    'UV',
    'IR',
];

export default function AddSessionForm({ projectId }: { projectId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<AddSessionFormSchema>({
        resolver: zodResolver(addSessionFormSchema),
        defaultValues: {
            date: new Date(),
            acquisitionDetails: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'acquisitionDetails',
    });

    const addAcquisitionDetail = () => {
        append({
            filter: '',
            subframes: undefined,
            exposurePerSubframe: undefined,
        });
    };

    const removeAcquisitionDetail = (index: number) => {
        remove(index);
    };

    const onSubmit = async (data: AddSessionFormSchema) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('date', format(data.date, 'yyyy-MM-dd'));
            formData.append('acquisitionDetails', JSON.stringify(data.acquisitionDetails));

            const result = await createSession(projectId, formData);

            if (!result.success) {
                throw new Error(result.error || 'Failed to create session');
            } else {
                window.location.replace(`/projects/${projectId}`);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
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

                {/* Acquisition Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Acquisition Details</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addAcquisitionDetail}
                            disabled={isLoading}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>

                    {fields.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            No acquisition details added yet. Click &quot;Add&quot; to get started.
                        </p>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex gap-4">
                                {/* Filter Selection */}
                                <FormField
                                    control={form.control}
                                    name={`acquisitionDetails.${index}.filter`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Filter</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select filter" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {filterOptions.map((filter) => (
                                                        <SelectItem key={filter} value={filter}>
                                                            {filter}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Quick:
                                                </span>
                                                {[
                                                    { short: 'L', full: 'Luminance' },
                                                    { short: 'R', full: 'Red' },
                                                    { short: 'G', full: 'Green' },
                                                    { short: 'B', full: 'Blue' },
                                                    { short: 'Ha', full: 'Ha' },
                                                    { short: 'OIII', full: 'OIII' },
                                                    { short: 'SII', full: 'SII' },
                                                ].map((filter) => (
                                                    <button
                                                        key={filter.full}
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                        onClick={() => field.onChange(filter.full)}
                                                        disabled={isLoading}
                                                    >
                                                        {filter.short}
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Number of Subframes */}
                                <FormField
                                    control={form.control}
                                    name={`acquisitionDetails.${index}.subframes`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subframes</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    // step="1"
                                                    placeholder="Number of subframes"
                                                    disabled={isLoading}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(
                                                            value === ''
                                                                ? undefined
                                                                : parseInt(value, 10)
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Add:
                                                </span>
                                                {[1, 5, 10, 50, 100].map((increment) => (
                                                    <button
                                                        key={increment}
                                                        type="button"
                                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                        onClick={() => {
                                                            const current = field.value || 0;
                                                            field.onChange(current + increment);
                                                        }}
                                                        disabled={isLoading}
                                                    >
                                                        +{increment}
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Exposure per Subframe */}
                                <FormField
                                    control={form.control}
                                    name={`acquisitionDetails.${index}.exposurePerSubframe`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exposure (seconds)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.0001"
                                                    placeholder="Exposure time"
                                                    disabled={isLoading}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        field.onChange(
                                                            value === ''
                                                                ? undefined
                                                                : parseFloat(value)
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    Quick:
                                                </span>
                                                {[1, 5, 10, 30, 60, 180, 300, 600].map(
                                                    (seconds) => (
                                                        <button
                                                            key={seconds}
                                                            type="button"
                                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                            onClick={() => field.onChange(seconds)}
                                                            disabled={isLoading}
                                                        >
                                                            {seconds}s
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAcquisitionDetail(index)}
                                    disabled={isLoading}
                                >
                                    <Trash2Icon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

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
