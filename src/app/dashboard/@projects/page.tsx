'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/client/auth/auth-context';
import { auth } from '@/lib/client/firebase/config';
import { Project } from '@/schemas/project';

export default function Projects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function loadProjects() {
            setLoading(true);
            if (!user) {
                setLoading(false);
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
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, [user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {projects.length === 0 ? (
                <p className="text-muted-foreground">
                    You don&apos;t have any projects yet. Create your first project to get started.
                </p>
            ) : (
                <div className="flex gap-2">
                    {projects.map((project) => (
                        <Button asChild key={project.id}>
                            <Link href={`/projects/${project.id}`}>{project.name}</Link>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
