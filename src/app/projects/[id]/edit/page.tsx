'use client';

import { EditProjectForm } from '@/components/forms/edit-project-form';
import { use } from 'react';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Edit Project</h1>
            <EditProjectForm projectId={id} />
        </div>
    );
}
