'use client';

import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loginAction, logoutAction } from '@/lib/server/actions/auth';

export class AuthService {
  static async signIn(email: string, password: string): Promise<void> {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Create server session
      const result = await loginAction(idToken);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }
  
  static async signOut(): Promise<void> {
    try {
      // Clear server session
      await logoutAction();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
  
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
  
  static async refreshSession(): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      try {
        const idToken = await user.getIdToken(true); // Force refresh
        
        const result = await loginAction(idToken);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to refresh session');
        }
      } catch (error) {
        console.error('Session refresh error:', error);
        // If refresh fails, sign out
        await this.signOut();
      }
    }
  }
}
