'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/client/firebase/config';
import { User } from '@/schemas/user';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Convert Firebase user to our User type
                const user: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    displayName: firebaseUser.displayName || undefined,
                    photoURL: firebaseUser.photoURL || undefined,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}
