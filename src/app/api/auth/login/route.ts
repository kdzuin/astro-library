import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, setSessionCookie } from '@/lib/server/auth/utils';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
        }

        // Create and set session cookie
        const sessionCookie = await createSessionCookie(idToken);
        await setSessionCookie(sessionCookie);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
