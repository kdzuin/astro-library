'use client';

import { ReactNode } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BackButton } from '@/components/layout/back-button';

interface PageHeaderProps {
    hasBackButton?: boolean;
    title: React.ReactNode;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({ title, actions, hasBackButton, className = '' }: PageHeaderProps) {
    return (
        <header
            className={cn(
                'flex flex-col',
                'gap-2 lg:gap-4',
                'lg:justify-between lg:items-center lg:flex-row',
                className
            )}
        >
            <div className="flex items-center gap-2">
                {hasBackButton && <BackButton />}
                <h1 className="text-3xl font-bold text-start m-0">{title}</h1>
            </div>
            <div
                className={cn(
                    'flex items-center gap-2 self-start justify-between w-full lg:w-auto'
                )}
            >
                <div className="flex items-center gap-2">{actions}</div>
                <div className="max-lg:absolute max-lg:right-4 max-lg:top-4 w-auto">
                    <SidebarTrigger />
                </div>
            </div>
        </header>
    );
}
