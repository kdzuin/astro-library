import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
    title: React.ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, actions, className = '' }: PageHeaderProps) {
    return (
        <header className={`flex items-center justify-between gap-4 ${className}`}>
            <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                {actions}
                <SidebarTrigger className="size-10" />
            </div>
        </header>
    );
}
