import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mocked } from 'storybook/test';

import AddSessionForm from './add-session-form';
import { createSession } from '@/lib/server/actions/sessions';

export default {
    title: 'Forms/AddSessionForm',
    component: AddSessionForm,
} as Meta<typeof AddSessionForm>;

export const Primary: StoryObj<typeof AddSessionForm> = {
    args: {
        projectId: 'project-1',
    },
    beforeEach: async () => {
        mocked(createSession);
    },
};
