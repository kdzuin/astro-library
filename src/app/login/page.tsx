import { SignIn } from '@/components/features/auth/sign-in';
export const dynamic = 'force-dynamic';

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <SignIn />
        </div>
    );
}
