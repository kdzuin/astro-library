import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/schemas/project';
import { ProjectCard } from '@/components/features/projects/project-card';
import { PageHeader } from '@/components/layout/page-header';
import { requireAuth } from '@/lib/server/auth/utils';
import { getUserProjects } from '@/lib/server/transport/projects';
import { revalidatePath } from 'next/cache';

// Server Action for refreshing projects data
async function refreshProjects() {
    'use server';
    revalidatePath('/projects');
}

// Server-side data fetching with caching
async function getProjects(): Promise<Project[]> {
    try {
        const user = await requireAuth();

        // Direct database access is more efficient for server components
        const projects = await getUserProjects(user.id);
        return projects;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Return empty array instead of throwing to prevent error boundary
        return [];
    }
}

// Server Component - runs on the server
export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="space-y-6">
            <PageHeader
                title="My Projects"
                actions={
                    <>
                        <form action={refreshProjects}>
                            <Button type="submit" variant="outline">
                                <RefreshCw />
                                Refresh
                            </Button>
                        </form>
                        <Button asChild>
                            <Link href="/projects/add">
                                <Plus />
                                New Project
                            </Link>
                        </Button>
                    </>
                }
            />

            {projects.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <div className="text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium">No projects yet</h3>
                                <p className="text-sm">
                                    Create your first astronomy project to get started.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/projects/add">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Project
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            )}
        </main>
    );
}
