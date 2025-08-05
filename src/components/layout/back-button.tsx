'use client';

import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function BackButton() {
    const router = useRouter();

    return (
        <Button variant="secondary" size="icon" onClick={() => router.back()}>
            <ArrowLeftIcon />
        </Button>
    );
}
