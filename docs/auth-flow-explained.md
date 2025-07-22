# Google OAuth Authentication Flow in Astro Library

This document explains the complete authentication flow with Google in the Astro Library application.

## 1. Initial Authentication Trigger

When a user clicks "Sign in with Google" in the `SignIn` component, it triggers:

```typescript
// src/components/features/auth/sign-in.tsx
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
```

This uses Firebase's `signInWithPopup` to open a Google sign-in popup window.

## 2. Google Authentication Process

1. The popup window takes the user to Google's authentication page
2. User enters their Google credentials or selects their account
3. Google verifies the credentials and asks for consent to share data with your app
4. Upon approval, Google generates an OAuth token and redirects back to your application

## 3. Firebase Authentication Handling

Firebase handles the OAuth token from Google and:

1. Creates or retrieves a Firebase user account
2. Associates the Google credentials with this account
3. Triggers the `onAuthStateChanged` listener in your `AuthContext`

## 4. NextAuth.js Integration

In parallel, NextAuth.js handles the OAuth flow through your API route:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
const authOptions = {
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
    },
    callbacks: {
        async session({ session, token }) {
            // Session customization if needed
            return session;
        },
    },
};
```

The NextAuth API route (`/api/auth/[...nextauth]/route.ts`) handles:

1. The initial authentication request
2. The callback from Google with the OAuth token
3. Session management
4. Storing user data in Firestore via the FirestoreAdapter

## 5. Application State Update

When Firebase detects the authenticated user, your `AuthContext` updates:

```typescript
// src/lib/auth/auth-context.tsx
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            // Convert Firebase user to our User type
            const user: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
            };
            setUser(user);
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
}, []);
```

## 6. UI Response

The `AuthLayout` component reacts to the authentication state:

```typescript
// src/components/layout/auth-layout.tsx
export function AuthLayout({ children }: AuthLayoutProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <SignIn />
            </div>
        );
    }

    return <>{children}</>;
}
```

If the user is authenticated, it renders the protected content. If not, it shows the SignIn component.

## 7. Profile Image Handling

When displaying the user's Google profile image, we handle potential CORS and rate limiting issues:

```tsx
// src/app/dashboard/page.tsx
<div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-medium">
    {user?.photoURL ? (
        <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
        />
    ) : (
        <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
    )}
</div>
```

The `referrerPolicy="no-referrer"` attribute prevents sending the referrer header to Google's servers, which helps bypass their cross-origin restrictions. We also implement a fallback to display the user's initial if the image fails to load.

## Complete Flow Summary

1. User clicks "Sign in with Google"
2. Firebase opens Google authentication popup
3. User authenticates with Google
4. Google sends OAuth token back to your app
5. Firebase creates/retrieves user account
6. NextAuth handles the OAuth callback and session
7. AuthContext updates with user information
8. AuthLayout renders appropriate UI based on auth state
9. User profile data (including image) is displayed with proper CORS handling

This dual approach with Firebase Auth and NextAuth.js gives you both real-time authentication state management and server-side session handling for your application.
