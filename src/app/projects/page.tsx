'use server';

import { ProjectList } from '@/components/features/projects/project-list';

export default async function ProjectsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-semibold mb-6">Projects</h1>
            <ProjectList />
        </div>
    );
}
