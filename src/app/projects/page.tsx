import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDb } from '@/lib/server/firebase/firestore';
import { requireAuth } from '@/lib/server/auth/utils';
import { Project } from '@/schemas/project';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, EyeOff, Plus } from 'lucide-react';
import Link from 'next/link';

async function getProjects(): Promise<Project[]> {
    try {
        const user = await requireAuth();
        console.log('🔍 DEBUG: Current user from auth:', {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
        });

        const db = await getDb();

        // 1. Get user's project references
        console.log('Fetching user document for project references...');
        const userDoc = await db.collection('users').doc(user.id).get();
        const userData = userDoc.data();
        const projectIds = userData?.projects || [];

        console.log('User projects array:', projectIds);

        if (projectIds.length === 0) {
            console.log('No projects found for user');
            return [];
        }

        // 2. Batch fetch all user's projects
        console.log('Batch fetching projects...');
        const projectRefs = projectIds.map((id: string) => db.collection('projects').doc(id));
        const projectDocs = await db.getAll(...projectRefs);

        // 3. Process and sort projects
        const projects: Project[] = projectDocs
            .filter((doc) => doc.exists)
            .map((doc) => {
                const data = doc.data()!;
                console.log('Project document data:', { id: doc.id, ...data });

                return {
                    id: doc.id,
                    ...data,
                    // Convert Firestore timestamps to Date objects
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Project;
            })
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        console.log('Processed projects:', projects.length);

        return projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

function ProjectCard({ project }: { project: Project }) {
    const sessionCount = Object.keys(project.sessions || {}).length;
    const totalExposureTime = Object.values(project.sessions || {}).reduce(
        (total, session) => total + (session.totalExposureTime || 0),
        0
    );

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">
                            <Link
                                href={`/projects/${project.id}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {project.name}
                            </Link>
                        </CardTitle>
                        {project.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        {project.visibility === 'private' ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Project metadata */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{project.status}</Badge>
                        {project.catalogueDesignation && (
                            <Badge variant="outline">{project.catalogueDesignation}</Badge>
                        )}
                        {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {project.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                +{project.tags.length - 2} more
                            </Badge>
                        )}
                    </div>

                    {/* Session stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {sessionCount} session{sessionCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {totalExposureTime > 0 && (
                            <div>{Math.round(totalExposureTime)} min total</div>
                        )}
                    </div>

                    {/* Last updated */}
                    <div className="text-xs text-muted-foreground">
                        Updated {project.updatedAt.toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <main className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Button asChild>
                    <Link href="/projects/add">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Link>
                </Button>
            </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </main>
    );
}
