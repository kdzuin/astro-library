import { Button } from '@/components/ui/button';
import { getProjectsByUserId } from '@/lib/server/actions/projects';
import { requireAuth } from '@/lib/server/auth/utils';
import {
    // Plus,
    Sparkle,
} from 'lucide-react';
import Link from 'next/link';

export default async function ProjectsSegment() {
    const user = await requireAuth();
    const projectsFetch = await getProjectsByUserId(user.id);
    const projects = projectsFetch.data;

    return (
        <div className="flex gap-2 flex-wrap">
            {projects.map((project) => (
                <Button variant="outline" asChild size="sm" key={project.id}>
                    <Link href={`/projects/${project.id}`}>
                        <Sparkle />
                        {project.name}
                    </Link>
                </Button>
            ))}
            {/* <Button variant="outline" asChild size="sm">
                <Link href="/projects/add">
                    <Plus />
                </Link>
            </Button> */}
        </div>
    );
}
