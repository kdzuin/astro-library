import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/schemas/project';
import { ProjectCard } from '@/components/features/projects/project-card';
import { PageHeader } from '@/components/layout/page-header';
import { requireAuth } from '@/lib/server/auth/utils';
import { getProjectsByUserId } from '@/lib/server/transport/projects';

// Server-side data fetching with caching
async function fetchProjects(): Promise<Project[]> {
    try {
        const user = await requireAuth();

        // Direct database access is more efficient for server components
        const projects = await getProjectsByUserId(user.id);
        return projects;
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Return empty array instead of throwing to prevent error boundary
        return [];
    }
}

// Server Component - runs on the server
export default async function ProjectsPage() {
    const projects = await fetchProjects();

    return (
        <main className="space-y-6">
            <PageHeader
                title="My Projects"
                actions={
                    <>
                        <Button variant="default" asChild>
                            <Link href="/projects/add">
                                <Plus />
                                Add Project
                            </Link>
                        </Button>
                    </>
                }
            />

            {projects.length === 0 ? (
                <div className="p-6 text-center">No projects yet.</div>
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
