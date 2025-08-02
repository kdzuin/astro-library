import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/schemas/project';

interface ProjectCardProps {
    project: Project;
}

function mapStatusToLabel(status: Project['status']): string {
    switch (status) {
        case 'active':
            return 'Active';
        case 'planning':
            return 'Planning';
        case 'processing':
            return 'Processing';
        case 'completed':
            return 'Completed';
    }
}

export function ProjectCard({ project }: ProjectCardProps) {
    const sessionCount = Object.keys(project.sessions || {}).length;
    const totalExposureTime = Object.values(project.sessions || {}).reduce(
        (total, session) =>
            total +
            (session.filters.reduce(
                (total, filter) => total + filter.exposureTime * filter.frameCount,
                0
            ) || 0),
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
                        <Badge variant="secondary" data-testid="project-status">
                            {mapStatusToLabel(project.status)}
                        </Badge>
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
