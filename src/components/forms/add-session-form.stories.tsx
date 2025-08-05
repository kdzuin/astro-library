import { Meta, StoryObj } from '@storybook/nextjs-vite';
import AddSessionForm from './add-session-form';

export default {
    title: 'Forms/AddSessionForm',
    component: AddSessionForm,
} as Meta<typeof AddSessionForm>;

export const Primary: StoryObj<typeof AddSessionForm> = {
    args: {
        projectId: '1',
    },
};
