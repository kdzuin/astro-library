'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { getProjectsByUserId, Project } from '@/structures/projects';

export default function Projects() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProjects() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const userProjects = await getProjectsByUserId(user.id);
                setProjects(userProjects);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, [user]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Projects</h2>
                <Button asChild size="sm" variant="outline">
                    <Link href="/projects/add">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Project
                    </Link>
                </Button>
            </div>

            {loading ? (
                <p className="text-muted-foreground">Loading projects...</p>
            ) : projects.length === 0 ? (
                <p className="text-muted-foreground">
                    You don&apos;t have any projects yet. Create your first project to get started.
                </p>
            ) : (
                <ul className="space-y-2">
                    {projects.map((project) => (
                        <li key={project.id} className="border-b pb-2">
                            <Link
                                href={`/projects/${project.id}`}
                                className="text-primary hover:underline block"
                            >
                                {project.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
