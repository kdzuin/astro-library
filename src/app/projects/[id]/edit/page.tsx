'use client';

import { EditProjectForm } from '@/components/forms/edit-project-form';

interface EditProjectPageProps {
    params: {
        id: string;
    };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Edit Project</h1>
            <EditProjectForm projectId={params.id} />
        </div>
    );
}
