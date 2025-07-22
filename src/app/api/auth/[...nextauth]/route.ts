import NextAuth, { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    }),
    session: {
        strategy: 'jwt',
        // Set session to expire after 4 weeks (28 days)
        maxAge: 28 * 24 * 60 * 60, // 28 days in seconds
        // Update session expiry on each visit
        updateAge: 24 * 60 * 60, // 1 day in seconds
    },
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session?.user) {
                return { ...session, user: { ...session.user, id: token.sub } };
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
