import { fn } from 'storybook/test';

// Default mock implementation for Storybook
export const useGoogleSignIn = fn().mockReturnValue({
    signIn: fn().mockResolvedValue(true),
    isLoading: false,
    error: undefined,
});
