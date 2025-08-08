import { Button } from '@/components/ui/button';
import { getProjectsByUserId } from '@/lib/server/actions/projects';
import { requireAuth } from '@/lib/server/auth/utils';
import { Sparkle } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectsSegment() {
    const user = await requireAuth();
    const projectsFetch = await getProjectsByUserId(user.id);
    const projects = projectsFetch.data;

    return (
        <div className="flex gap-2 flex-wrap">
            {projects.map((project) => (
                <div key={project.id}>
                    <Button variant="outline" asChild size="sm">
                        <Link href={`/projects/${project.id}`}>
                            <Sparkle />
                            {project.name}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
