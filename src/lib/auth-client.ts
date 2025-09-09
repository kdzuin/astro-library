import { createAuthClient } from "better-auth/react";
import { createContext, useContext } from "react";

import type { User } from "better-auth";

export const { signIn, signOut, useSession, getSession } = createAuthClient({});

interface AuthContextValue {
	currentUser?: Partial<User> | null;
	userId?: User["id"] | null;
}

const AuthContext = createContext<AuthContextValue>({
	currentUser: null,
	userId: null,
});

export const AuthProvider = AuthContext.Provider;

export const useAuth = () => {
	return useContext(AuthContext);
};
