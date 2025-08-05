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
            className={`flex justify-between items-stretch flex-col-reverse lg:items-center lg:flex-row gap-4 ${className}`}
        >
            <div className="flex items-center gap-2">
                {hasBackButton && <BackButton />}
                <h1 className="text-3xl font-bold text-start m-0">{title}</h1>
            </div>
            <div
                className={cn(
                    'flex items-center gap-2 self-start justify-between w-full lg:w-auto',
                    !actions && 'max-lg:absolute max-lg:right-4 max-lg:top-4'
                )}
            >
                <div className="flex items-center gap-2">{actions}</div>
                <SidebarTrigger />
            </div>
        </header>
    );
}
