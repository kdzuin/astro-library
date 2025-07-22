'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const provider = new GoogleAuthProvider();
            // Force Google to show the account selection screen
            provider.setCustomParameters({
                prompt: 'select_account',
            });
            await signInWithPopup(auth, provider);
            // The user should be redirected or the UI updated via the AuthContext
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError('Failed to sign in with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
                variant="outline"
            >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
    );
}
