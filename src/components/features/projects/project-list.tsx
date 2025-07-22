'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { Project } from '@/schemas/project';

// Helper function to safely format dates
const formatDate = (dateValue: string | Date | undefined): string => {
    if (!dateValue) return 'Unknown date';

    try {
        // Handle both string and Date objects
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        return date.toLocaleDateString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Unknown date';
    }
};

export function ProjectList() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [projects, setProjects] = useState<Project[]>([]);

    // Create a memoized loadProjects function
    const loadProjects = useCallback(async () => {
        if (!user) {
            return;
        }

        try {
            // Get the current user's ID token
            const idToken = await auth.currentUser?.getIdToken(true);

            if (!idToken) {
                throw new Error('Authentication token not available');
            }

            // Fetch projects from the API route with the ID token
            const response = await fetch('/api/projects', {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch projects');
            }

            const data = await response.json();

            setProjects(data.projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects. Please try again.');
        }
    }, [user]);

    // Effect to load projects when component mounts, user changes, or refresh is triggered
    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // Effect to refresh projects when returning to this page
    useEffect(() => {
        // This will run when the component is mounted and when pathname changes
        if (pathname === '/projects') {
            loadProjects();
        }
    }, [pathname, loadProjects]);

    const navigateToProject = (projectId: string) => {
        router.push(`/projects/${projectId}`);
    };

    if (!user) {
        return (
            <div>
                <div>Authentication Required</div>
                <div>You need to be logged in to view projects</div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div>
                <div>Your Projects</div>
                <div>You don&apos;t have any projects yet</div>
                <Button asChild>
                    <Link href="/projects/add">Add Project</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button asChild>
                    <Link href="/projects/add">Add Project</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card
                        key={project.id}
                        className="flex flex-col cursor-pointer hover:border-primary transition-colors"
                        onClick={() => navigateToProject(project.id!)}
                    >
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>
                                Created: {formatDate(project.createdAt)}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-end mt-auto">
                            <Button variant="ghost" size="sm" className="text-primary">
                                View Project
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
