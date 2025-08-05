import { ProjectSessions } from '@/components/features/projects/project-sessions';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { getProjectById } from '@/lib/server/transport/projects';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    const project = await getProjectById(projectId);

    if (!project) {
        return notFound();
    }

    return (
        <main className="space-y-6">
            <PageHeader title={project.name} />

            <section>
                <h2>Final images:</h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto consequuntur
                    eaque officia, optio expedita ullam ad aliquam neque totam, eveniet, animi cum
                    soluta minima voluptate reprehenderit nihil ea dignissimos id!
                </p>
            </section>

            <section>
                <h2>Sessions:</h2>

                <div className="flex gap-4 my-4">
                    <Button asChild>
                        <Link href={`/projects/${project.id}/add-session`}>Add Session</Link>
                    </Button>
                </div>

                <ProjectSessions sessions={project.sessions} />
            </section>

            <section>
                <h2>Processing:</h2>

                <h3>Processing Notes:</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto consequuntur
                    eaque officia, optio expedita ullam ad aliquam neque totam, eveniet, animi cum
                    soluta minima voluptate reprehenderit nihil ea dignissimos id!
                </p>

                <h3>Processing Images:</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto consequuntur
                    eaque officia, optio expedita ullam ad aliquam neque totam, eveniet, animi cum
                    soluta minima voluptate reprehenderit nihil ea dignissimos id!
                </p>
            </section>
        </main>
    );
}
