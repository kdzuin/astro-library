import { ProjectSessions } from '@/components/features/projects/project-sessions';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getProjectById } from '@/lib/server/actions/projects';
import { getSessionsByProjectId } from '@/lib/server/actions/sessions';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    const projectFetch = await getProjectById(projectId);
    const project = projectFetch.data;

    const sessionsFetch = await getSessionsByProjectId(projectId);
    const sessions = sessionsFetch.data;

    if (!project) {
        return notFound();
    }

    return (
        <main className="space-y-6">
            <PageHeader hasBackButton title={project.name} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <section className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>
                                During this project, you logged {sessions.length || 0} sessions with
                                the total exposure time of X{' '}hours. The filter balance in the
                                project is 2:1:1. The most data is collected in H<sub>α</sub>{' '}
                                filter.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProjectSessions sessions={sessions} projectId={project.id} />
                        </CardContent>
                        <CardFooter className="border-t">
                            <Button asChild size="sm" variant="positive">
                                <Link href={`/projects/${project.id}/add-session`}>
                                    <Plus />
                                    Add Session
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </main>
    );
}
