'use client';

import AddProjectForm, { AddProjectFormSchema } from '@/components/forms/add-project-form';
import { useAuth } from '@/lib/client/auth/auth-context';
import { auth } from '@/lib/client/firebase/config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AddProject() {
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (data: AddProjectFormSchema) => {
        if (!user) {
            toast.error('You must be logged in to create a project');
            return;
        }

        try {
            // Get the current user's ID token
            const idToken = await auth.currentUser?.getIdToken();
            if (!idToken) {
                throw new Error('Authentication token not available');
            }

            // Call the API to create a project
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    name: data.projectName,
                    visibility: data.visibility,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create project');
            }

            toast.success('Project created successfully');

            // Close the modal by navigating back
            router.back();

            // Force a hard refresh of the projects page
            router.refresh();
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Failed to create project. Please try again.');
        } finally {
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return <AddProjectForm onSubmit={handleSubmit} onCancel={handleCancel} />;
}
