import { cn } from '@/lib/utils';

export default function ProjectsLoading() {
    return (
        <div className="flex gap-2 flex-wrap">
            {/* Skeleton buttons matching the actual project buttons */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-8 px-3 py-2 bg-muted rounded-md border border-input">
                        <div
                            className={cn(
                                'h-4 bg-muted-foreground/20 rounded',
                                ['w-10', 'w-20', 'w-10', 'w-16', 'w-10', 'w-24', 'w-16'][i % 7]
                            )}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
