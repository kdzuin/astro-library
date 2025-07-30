import { cookies } from 'next/headers';
import { User } from '@/schemas/user';
import { createSessionCookie as createFirebaseSessionCookie, verifySessionCookie as verifyFirebaseSessionCookie } from '@/lib/server/firebase/auth';
import { ensureUserExists } from '@/lib/server/user/utils';

const SESSION_COOKIE_NAME = 'session';
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string): Promise<string> {
  try {
    const sessionCookie = await createFirebaseSessionCookie(idToken, SESSION_COOKIE_MAX_AGE);
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw new Error('Failed to create session cookie');
  }
}

export async function setSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value || null;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function verifySessionCookie(sessionCookie: string): Promise<User | null> {
  try {
    const decodedToken = await verifyFirebaseSessionCookie(sessionCookie);
    
    if (!decodedToken) {
      // Session is invalid/expired - return null
      // Note: Cookie clearing must be done in a Server Action or Route Handler
      return null;
    }
    
    // Ensure user exists in database and get/create user document
    const user = await ensureUserExists({
      id: decodedToken.uid,
      email: decodedToken.email!,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
    });
    
    return user;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    // Note: Cookie clearing must be done in a Server Action or Route Handler
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const sessionCookie = await getSessionCookie();
    
    if (!sessionCookie) {
      return null;
    }
    
    return await verifySessionCookie(sessionCookie);
  } catch (error) {
    console.error('Error getting current user:', error);
    // Note: Cookie clearing must be done in a Server Action or Route Handler
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
