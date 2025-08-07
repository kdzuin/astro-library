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
                projectId: 'story-project-id',
                userId: 'story-user-id',
                date: '2025-04-01',
                tags: [],
            },
            {
                id: 'session-2',
                projectId: 'story-project-id',
                userId: 'story-user-id',
                date: '2025-04-02',
                tags: [],
            },
            {
                id: 'session-3',
                projectId: 'story-project-id',
                userId: 'story-user-id',
                date: '2025-04-03',
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
