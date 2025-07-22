'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { getProjectsByUserId, Project } from '@/structures/projects';
import { toast } from 'sonner';
import { Loader2, ArrowRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function ProjectList() {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Create a memoized loadProjects function
    const loadProjects = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const userProjects = await getProjectsByUserId(user.id);
            setProjects(userProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
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
            <Card>
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>You need to be logged in to view projects</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (projects.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Projects</CardTitle>
                    <CardDescription>You don&apos;t have any projects yet</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button asChild>
                        <Link href="/projects/add">Add Project</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Your Projects</h2>
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
                                Created: {project.createdAt?.toLocaleDateString() || 'Unknown date'}
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
