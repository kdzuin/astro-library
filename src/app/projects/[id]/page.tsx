'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { getProjectById, deleteProject, Project } from '@/structures/projects';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProjectPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const { user } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function loadProject() {
            if (!id || !user) {
                setLoading(false);
                return;
            }

            try {
                const projectData = await getProjectById(id);

                if (!projectData) {
                    toast.error('Project not found');
                    router.push('/projects');
                    return;
                }

                // Check if user owns this project
                if (projectData.userId !== user.id) {
                    toast.error('You do not have permission to view this project');
                    router.push('/projects');
                    return;
                }

                setProject(projectData);
            } catch (error) {
                console.error('Error loading project:', error);
                toast.error('Failed to load project');
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, [id, user, router]);

    const handleDelete = async () => {
        if (!project) return;

        try {
            setIsDeleting(true);
            await deleteProject(project.id);
            toast.success('Project deleted successfully');
            router.push('/projects');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-semibold mb-6">Project Not Found</h1>
                <p className="mb-4">
                    The project you're looking for doesn't exist or you don't have permission to
                    view it.
                </p>
                <Button asChild>
                    <Link href="/projects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Button asChild variant="outline" size="sm">
                    <Link href="/projects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Created:{' '}
                        {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : 'Unknown'}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Project Details</h3>
                            <p className="text-muted-foreground">
                                This is where additional project details will be displayed in the
                                future.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild variant="outline">
                        <Link href={`/projects/${project.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Project
                        </Link>
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    project <strong>"{project.name}"</strong> and all of its
                                    associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Project'
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
