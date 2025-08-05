import { SignIn } from '@/components/features/auth/sign-in';
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, mocked, userEvent, within } from 'storybook/test';

import { useGoogleSignIn } from '@/components/features/auth/useGoogleSignIn';

export default {
    title: 'Features/Auth/SignIn',
    component: SignIn,
} as Meta<typeof SignIn>;

export const Primary: StoryObj<typeof SignIn> = {
    args: {},
};

export const WithInitialError: StoryObj<typeof SignIn> = {
    args: {
        incomingError: 'There was an error. Try again.',
    },
};

export const WithError: StoryObj<typeof SignIn> = {
    args: {
        ...Primary.args,
    },
    beforeEach: async () => {
        mocked(useGoogleSignIn).mockImplementation(() => ({
            signIn: fn().mockResolvedValue(false),
            isLoading: false,
            error: 'Google return an error.',
        }));
    },
};

export const InProgress: StoryObj<typeof SignIn> = {
    args: {
        ...Primary.args,
    },
    beforeEach: async () => {
        mocked(useGoogleSignIn).mockImplementation(() => ({
            signIn: fn().mockResolvedValue(true),
            isLoading: true,
            error: undefined,
        }));
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const submitButton = await canvas.getByRole('button', {});

        await userEvent.click(submitButton);
    },
};
