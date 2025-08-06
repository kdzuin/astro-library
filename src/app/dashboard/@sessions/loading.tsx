import { cn } from '@/lib/utils';

export default function SessionsLoading() {
    return (
        <div className="flex gap-2 flex-wrap">
            {/* Skeleton buttons matching the actual project buttons */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-8 px-3 py-2 bg-muted rounded-md border border-input">
                        <div className={cn('h-4 bg-muted-foreground/20 rounded', 'w-20')}></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
