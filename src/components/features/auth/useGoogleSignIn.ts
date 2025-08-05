'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/client/firebase/config';

export function useGoogleSignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const signIn = async (): Promise<boolean> => {
        setIsLoading(true);
        setError(undefined);

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

            return true; // Success - let consumer handle what to do next
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError('Failed to sign in with Google. Please try again.');
            return false; // Failure
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn,
        isLoading,
        error,
    };
}
