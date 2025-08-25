import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Project } from '@/schemas/project';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ProjectCardProps = Project;

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

export function ProjectCard({
    id,
    name,
    description,
    status,
    tags,
    totalExposureTime = 0,
}: ProjectCardProps) {
    const totalExposureTimeInMinutes = Math.ceil(totalExposureTime / 60);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <Link href={`/projects/${id}`}>{name}</Link>
                </CardTitle>
                {description ? (
                    <CardDescription>
                        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                    </CardDescription>
                ) : null}
            </CardHeader>
            <CardContent>
                {/* Project metadata */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" data-testid="project-status">
                        {mapStatusToLabel(status)}
                    </Badge>

                    {tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}

                    {tags && tags.length > 2 ? (
                        <Badge variant="outline" className="text-xs">
                            +{tags.length - 2} more
                        </Badge>
                    ) : null}

                    {totalExposureTimeInMinutes ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge
                                    variant="outline"
                                    data-testid="total-exposure-time"
                                    title="Total exposure time"
                                >
                                    <span className="sr-only">Total exposure time:</span>
                                    {Math.round(totalExposureTimeInMinutes)} min
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>Total exposure time</TooltipContent>
                        </Tooltip>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}
