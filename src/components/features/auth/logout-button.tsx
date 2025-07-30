'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/client/auth/auth-service';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    children?: React.ReactNode;
}

export function LogoutButton({
    variant = 'outline',
    size = 'default',
    className,
    children = 'Sign Out',
}: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AuthService.signOut();
            router.push('/');
            router.refresh(); // Refresh to update server-side state
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            disabled={isLoading}
            variant={variant}
            size={size}
            className={className}
        >
            {isLoading ? 'Signing out...' : children}
        </Button>
    );
}
