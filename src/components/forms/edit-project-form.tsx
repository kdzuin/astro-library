'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { getProjectById, updateProject } from '@/lib/server/projects';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EditProjectFormProps {
    projectId: string;
}

export function EditProjectForm({ projectId }: EditProjectFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [projectName, setProjectName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProject() {
            if (!projectId) {
                setError('Project ID is required');
                setIsLoading(false);
                return;
            }

            try {
                const project = await getProjectById(projectId);

                if (!project) {
                    setError('Project not found');
                    return;
                }

                // Check if the user owns this project
                if (user && project.userId !== user.id) {
                    setError('You do not have permission to edit this project');
                    return;
                }

                setProjectName(project.name);
            } catch (error) {
                console.error('Error loading project:', error);
                setError('Failed to load project details');
            } finally {
                setIsLoading(false);
            }
        }

        if (user) {
            loadProject();
        } else {
            setIsLoading(false);
            setError('You must be logged in to edit a project');
        }
    }, [projectId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to update a project');
            return;
        }

        try {
            setIsSubmitting(true);

            await updateProject(projectId, {
                name: projectName,
            });

            toast.success('Project updated successfully');

            router.push('/projects');
            router.refresh(); // Refresh the page to show the updated project
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive">
                <p>{error}</p>
                <Button variant="outline" onClick={() => router.push('/projects')} className="mt-4">
                    Back to Projects
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="grid gap-3">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                    id="projectName"
                    placeholder="Enter project name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                />
            </div>
            <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Project'}
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
        </form>
    );
}
