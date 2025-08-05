import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: React.ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, actions, className = '' }: PageHeaderProps) {
    return (
        <header
            className={`flex justify-between items-stretch flex-col-reverse lg:items-center lg:flex-row gap-4 ${className}`}
        >
            <h1 className="text-3xl font-bold text-start m-0">{title}</h1>
            <div
                className={cn(
                    'flex items-center gap-2 self-start justify-between w-full lg:w-auto',
                    !actions && 'max-lg:absolute max-lg:right-4 max-lg:top-4'
                )}
            >
                <div className="flex items-center gap-2">{actions}</div>
                <SidebarTrigger className="size-10" />
            </div>
        </header>
    );
}
