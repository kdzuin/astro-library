import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession, getSession } = createAuthClient();
