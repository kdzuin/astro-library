import { ProjectSessions } from '@/components/features/projects/project-sessions';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getProjectById } from '@/lib/server/transport/projects';
import { getSessionByProjectId } from '@/lib/server/transport/sessions';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    const project = await getProjectById(projectId);
    const sessions = await getSessionByProjectId(projectId);

    if (!project) {
        return notFound();
    }

    return (
        <main className="space-y-6">
            <PageHeader hasBackButton title={project.name} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <section>
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>
                                During this project, you logged {sessions.length} sessions with the
                                total exposure time of{' '}
                                {(
                                    sessions.reduce(
                                        (acc, session) =>
                                            acc +
                                            session.filters.reduce(
                                                (acc, filter) => acc + filter.exposureTime,
                                                0
                                            ),
                                        0
                                    ) / 3600
                                ).toFixed(2)}
                                {' '}hours. The filter balance in the project is 2:1:1. The most
                                data is collected in H<sub>α</sub> filter.
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
