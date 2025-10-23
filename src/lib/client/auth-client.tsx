import { createAuthClient } from "better-auth/react";
import { createContext, useContext } from "react";

import type { User } from "better-auth";

export const { signIn, signOut, useSession, getSession } = createAuthClient({});

interface AuthContextValue {
    currentUser?: Partial<User> | null;
    userId?: User["id"] | null;
    isLoading?: boolean;
    signIn: typeof signIn;
    signOut: typeof signOut;
}

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    userId: null,
    isLoading: false,
    signIn,
    signOut,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();

    return (
        <AuthContext.Provider
            value={{
                currentUser: session?.user,
                userId: session?.user?.id,
                isLoading: isPending,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};
