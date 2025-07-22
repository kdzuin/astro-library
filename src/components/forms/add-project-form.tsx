'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { createProject } from '@/structures/projects';
import { toast } from 'sonner';

export function AddProjectForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [projectName, setProjectName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to create a project');
            return;
        }

        try {
            setIsSubmitting(true);

            await createProject({
                name: projectName,
                userId: user.id,
            });

            toast.success('Project created successfully');

            // Close the modal by navigating back
            router.back();

            // Force a hard refresh of the projects page
            router.refresh();

            // Navigate to projects page to ensure we're there after modal closes
            setTimeout(() => {
                router.push('/projects');
                router.refresh();
            }, 100);
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error('Failed to create project. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

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
        </form>
    );
}
