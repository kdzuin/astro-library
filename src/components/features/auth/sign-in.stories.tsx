import { SignIn } from '@/components/features/auth/sign-in';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, userEvent, within } from 'storybook/test';
import type { MockedFunction } from 'vitest';

// Import the mocked module - Storybook will automatically use the mock
import { useGoogleSignIn } from '@/components/features/auth/useGoogleSignIn';

// Type the mock for proper usage
const mockUseGoogleSignIn = useGoogleSignIn as MockedFunction<typeof useGoogleSignIn>;

export default {
    title: 'Features/Auth/Sign In Button',
    component: SignIn,
} as Meta<typeof SignIn>;

export const Primary: StoryObj<typeof SignIn> = {
    args: {},
    beforeEach: async () => {
        mockUseGoogleSignIn.mockReturnValue({
            signIn: fn().mockResolvedValue(true),
            isLoading: false,
            error: undefined,
        });
    },
};

export const WithInitialError: StoryObj<typeof SignIn> = {
    args: {
        incomingError: 'There was an error. Try again.',
    },
    beforeEach: async () => {
        mockUseGoogleSignIn.mockReturnValue({
            signIn: fn().mockResolvedValue(true),
            isLoading: false,
            error: undefined,
        });
    },
};

export const WithError: StoryObj<typeof SignIn> = {
    args: {
        ...Primary.args,
    },
    beforeEach: async () => {
        mockUseGoogleSignIn.mockReturnValue({
            signIn: fn().mockResolvedValue(false),
            isLoading: false,
            error: 'Google return an error.',
        });
    },
};

export const InProgress: StoryObj<typeof SignIn> = {
    args: {
        ...Primary.args,
    },
    beforeEach: async () => {
        mockUseGoogleSignIn.mockReturnValue({
            signIn: fn().mockResolvedValue(true),
            isLoading: true,
            error: undefined,
        });
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const submitButton = await canvas.getByRole('button', {});

        await userEvent.click(submitButton);
    },
};
