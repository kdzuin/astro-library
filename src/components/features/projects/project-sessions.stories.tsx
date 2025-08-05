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
        projectId: 'story-project-id',
        sessions: [
            {
                id: 'session-1',
                date: '2025-04-01',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            {
                id: 'session-2',
                date: '2025-04-02',
                filters: [],
                equipmentIds: [],
                tags: [],
            },
            {
                id: 'session-3',
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
        projectId: 'story-project-id',
        sessions: [],
    },
};
