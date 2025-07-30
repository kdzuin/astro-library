'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/client/firebase/config';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const provider = new GoogleAuthProvider();
            // Force Google to show the account selection screen
            provider.setCustomParameters({
                prompt: 'select_account',
            });
            
            const userCredential = await signInWithPopup(auth, provider);
            const idToken = await userCredential.user.getIdToken();
            
            // Create server session using our AuthService
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create session');
            }
            
            // Redirect to dashboard after successful login
            router.push('/dashboard');
            router.refresh(); // Refresh to update server-side state
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
