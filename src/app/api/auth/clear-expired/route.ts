import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/server/auth/utils';

/**
 * POST /api/auth/clear-expired
 * Clears expired session cookies - can be called when session verification fails
 */
export async function POST() {
    try {
        await clearSessionCookie();
        return NextResponse.json({ 
            success: true, 
            message: 'Expired session cookie cleared' 
        });
    } catch (error) {
        console.error('Error clearing expired session:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to clear expired session' 
            }, 
            { status: 500 }
        );
    }
}
