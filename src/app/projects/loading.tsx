import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

export default function ProjectsLoading() {
    return (
        <main className="space-y-6">
            <PageHeader title="My Projects" />

            {/* Loading skeleton grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Project card skeletons */}
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            {/* Header skeleton */}
                            <div className="flex items-start justify-between">
                                <div className="h-6 bg-muted rounded w-3/4"></div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Badges skeleton */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="h-6 bg-muted rounded-full w-16"></div>
                                <div className="h-6 bg-muted rounded-full w-12"></div>
                                <div className="h-6 bg-muted rounded-full w-20"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
