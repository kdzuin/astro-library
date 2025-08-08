import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ProjectCard } from '@/components/features/projects/project-card';
import { PageHeader } from '@/components/layout/page-header';
import { requireAuth } from '@/lib/server/auth/utils';
import { getProjectsByUserId } from '@/lib/server/actions/projects';

export const dynamic = 'force-dynamic';

// Server Component - runs on the server
export default async function ProjectsPage() {
    const user = await requireAuth();
    const projectsFetch = await getProjectsByUserId(user.id);

    const projects = projectsFetch.data || [];

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
