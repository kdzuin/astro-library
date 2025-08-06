'use client';

import React, { useState, useTransition } from 'react';
import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { updateSessionAcquisitionDetails } from './actions';

interface AcquisitionDetail {
    id?: string;
    filterName?: string;
    numberOfExposures: number;
    exposureTime: number;
    isModified?: boolean;
    isSaved?: boolean;
}

interface SessionDetailsClientProps {
    projectId: string;
    sessionId: string;
    initialData: {
        projectName: string;
        sessionDate: string;
        acquisitionDetails: AcquisitionDetail[];
    };
}

export default function SessionDetailsClient({
    projectId,
    sessionId,
    initialData,
}: SessionDetailsClientProps) {
    const [acquisitionDetails, setAcquisitionDetails] = useState<AcquisitionDetail[]>(
        initialData.acquisitionDetails.length > 0 
            ? initialData.acquisitionDetails.map(detail => ({ ...detail, isSaved: true }))
            : [{ filterName: '', numberOfExposures: 1, exposureTime: 1 }]
    );
    const [isPending, startTransition] = useTransition();

    const addNewRow = () => {
        setAcquisitionDetails(prev => [
            ...prev,
            { filterName: '', numberOfExposures: 1, exposureTime: 1 }
        ]);
    };

    const removeRow = (index: number) => {
        setAcquisitionDetails(prev => prev.filter((_, i) => i !== index));
    };

    const updateRow = (index: number, field: keyof AcquisitionDetail, value: string | number) => {
        setAcquisitionDetails(prev => prev.map((detail, i) => 
            i === index 
                ? { ...detail, [field]: value, isModified: true, isSaved: false }
                : detail
        ));
    };

    const handleSave = () => {
        startTransition(async () => {
            try {
                // Prepare data for server action
                const dataToSave = acquisitionDetails.map(detail => ({
                    projectId,
                    sessionId,
                    userId: '', // Will be set by server action
                    filterName: detail.filterName || undefined,
                    numberOfExposures: detail.numberOfExposures,
                    exposureTime: detail.exposureTime,
                }));

                const result = await updateSessionAcquisitionDetails(projectId, sessionId, dataToSave);
                
                if (result.success) {
                    // Mark all rows as saved
                    setAcquisitionDetails(prev => prev.map(detail => ({
                        ...detail,
                        isModified: false,
                        isSaved: true
                    })));
                    toast.success('Session updated successfully');
                } else {
                    toast.error(result.error || 'Failed to update session');
                }
            } catch (error) {
                console.error('Save error:', error);
                toast.error('Failed to update session');
            }
        });
    };

    const getRowIcon = (detail: AcquisitionDetail) => {
        if (detail.isSaved && !detail.isModified) {
            return <Check className="h-4 w-4 text-green-600" />;
        }
        if (detail.isModified || !detail.isSaved) {
            return <Edit className="h-4 w-4 text-orange-600" />;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">Session Details</h1>
                <div className="text-sm text-muted-foreground mt-2">
                    <p><strong>Project:</strong> {initialData.projectName}</p>
                    <p><strong>Session Date:</strong> {new Date(initialData.sessionDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Acquisition Details Form */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Acquisition Details</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addNewRow}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        One more
                    </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                    <table className="decorated-table w-full">
                        <thead>
                            <tr>
                                <th className="text-left p-3 bg-muted/50">Status</th>
                                <th className="text-left p-3 bg-muted/50">Filter Name</th>
                                <th className="text-left p-3 bg-muted/50">Exposures</th>
                                <th className="text-left p-3 bg-muted/50">Exposure Time (s)</th>
                                <th className="text-left p-3 bg-muted/50">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acquisitionDetails.map((detail, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-3">
                                        <div className="flex items-center justify-center">
                                            {getRowIcon(detail)}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            type="text"
                                            value={detail.filterName || ''}
                                            onChange={(e) => updateRow(index, 'filterName', e.target.value)}
                                            placeholder="Optional filter name"
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={detail.numberOfExposures}
                                            onChange={(e) => updateRow(index, 'numberOfExposures', parseInt(e.target.value) || 1)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={detail.exposureTime}
                                            onChange={(e) => updateRow(index, 'exposureTime', parseFloat(e.target.value) || 0.1)}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="p-3">
                                        {acquisitionDetails.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeRow(index)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="min-w-[100px]"
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
