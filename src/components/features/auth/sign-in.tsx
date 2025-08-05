'use client';

import { Button } from '@/components/ui/button';
import { useGoogleSignIn } from '@/components/features/auth/useGoogleSignIn';
import { useRouter } from 'next/navigation';

export function SignIn({ incomingError }: { incomingError?: string }) {
    const { signIn, isLoading, error } = useGoogleSignIn();
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        const success = await signIn();
        if (success) {
            // Redirect to dashboard after successful login
            router.push('/dashboard');
            router.refresh(); // Refresh to update server-side state
        }
    };

    return (
        <div>
            <div className="flex justify-center">
                <Button onClick={handleGoogleSignIn} disabled={isLoading} variant="outline">
                    {isLoading ? 'Signing in...' : 'Sign in with Google'}
                </Button>
            </div>
            {(error || incomingError) && (
                <p className="text-sm text-red-500 text-center">{error || incomingError}</p>
            )}
        </div>
    );
}
