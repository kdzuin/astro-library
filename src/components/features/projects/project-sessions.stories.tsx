import { ProjectSessions } from '@/components/features/projects/project-sessions';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

export default {
    title: 'Features/Projects/Project Sessions',
    component: ProjectSessions,
} as Meta<typeof ProjectSessions>;

export const Primary: StoryObj<typeof ProjectSessions> = {
    args: {
        sessions: {
            '2025-04-01': {
                date: '2025-04-01',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            '2025-04-02': {
                date: '2025-04-02',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            '2025-04-03': {
                date: '2025-04-03',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
        },
    },
};

export const Empty: StoryObj<typeof ProjectSessions> = {
    args: {
        sessions: {},
    },
};
