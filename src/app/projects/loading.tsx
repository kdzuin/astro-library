import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsLoading() {
    return (
        <main className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <div className="flex items-center gap-2">
                    {/* Disabled refresh button during loading */}
                    <Button variant="outline" size="sm" disabled>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                    </Button>
                    <Button asChild>
                        <Link href="/projects/add">
                            <Plus className="h-4 w-4 mr-2" />
                            New Project
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Loading skeleton grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Project card skeletons */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="p-6">
                            {/* Header skeleton */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-2 flex-1">
                                    <div className="h-6 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                    <div className="h-4 bg-muted rounded w-2/3"></div>
                                </div>
                                <div className="h-4 w-4 bg-muted rounded ml-4"></div>
                            </div>
                            
                            {/* Badges skeleton */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="h-6 bg-muted rounded-full w-16"></div>
                                <div className="h-6 bg-muted rounded-full w-12"></div>
                                <div className="h-6 bg-muted rounded-full w-20"></div>
                            </div>
                            
                            {/* Stats skeleton */}
                            <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                    <div className="h-4 w-4 bg-muted rounded"></div>
                                    <div className="h-4 bg-muted rounded w-16"></div>
                                </div>
                                <div className="h-4 bg-muted rounded w-12"></div>
                            </div>
                            
                            {/* Last updated skeleton */}
                            <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                    </Card>
                ))}
            </div>
            
            {/* Loading indicator */}
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <p className="text-muted-foreground">Loading projects...</p>
            </div>
        </main>
    );
}
