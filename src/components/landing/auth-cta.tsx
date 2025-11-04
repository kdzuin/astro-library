import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/client/auth-client";
import { Link } from "@tanstack/react-router";

export function AuthCTA({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { signIn, signOut } = useAuth();

    const handleSignOut = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        await signOut();
        window.location.reload();
    };

    const handleSignIn = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
            newUserCallbackURL: "/dashboard",
        });
    };

    // Show authenticated UI if user exists or we're optimistically assuming they're logged in
    if (isLoggedIn) {
        return (
            <>
                <Button asChild variant="prominent">
                    <Link to="/dashboard">Continue to Dashboard</Link>
                </Button>
                <Button onClick={handleSignOut}>Logout</Button>
            </>
        );
    }

    // Show sign in button for anonymous users
    return <Button onClick={handleSignIn}>Continue with Google</Button>;
}
