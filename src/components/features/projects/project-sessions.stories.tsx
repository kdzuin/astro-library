import {
    ProjectSessions,
    ProjectSessionsProps,
} from '@/components/features/projects/project-sessions';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

export default {
    title: 'Features/Projects/Project Sessions',
    component: ProjectSessions,
} as Meta<ProjectSessionsProps>;

export const Primary: StoryObj<ProjectSessionsProps> = {
    args: {
        sessions: [
            {
                date: '2025-04-01',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            {
                date: '2025-04-02',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            {
                date: '2025-04-03',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
        ],
    },
};

export const Empty: StoryObj<ProjectSessionsProps> = {
    args: {
        sessions: [],
    },
};
