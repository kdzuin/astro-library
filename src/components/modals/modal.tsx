'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
} from '@/components/ui/dialog';

export function Modal({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
}) {
    const router = useRouter();

    const handleOpenChange = () => {
        router.back();
    };

    return (
        <Dialog defaultOpen open onOpenChange={handleOpenChange}>
            <DialogOverlay>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    );
}
