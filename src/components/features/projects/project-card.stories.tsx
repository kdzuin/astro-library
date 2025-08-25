import { ProjectCard, ProjectCardProps } from '@/components/features/projects/project-card';
import { Project } from '@/schemas/project';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
    title: 'Features/Projects/Project Card',
    component: ProjectCard,
    parameters: {
        // layout: 'centered',
    },
    tags: ['autodocs'],
    excludeStories: ['_mockProjectTotalExposureInSeconds', '_mockProjectTotalExposureInMinutes'],
} as Meta<ProjectCardProps>;

export default meta;
type Story = StoryObj<ProjectCardProps>;

const mockProject: Project = {
    id: 'test-project-1',
    userId: 'user-123',
    name: 'NGC 7000 - North America Nebula',
    description: 'A large emission nebula in the constellation Cygnus, near Deneb.',
    visibility: 'private',
    status: 'active',
    tags: [],
    createdAt: new Date('2024-07-01T10:00:00Z'),
    updatedAt: new Date('2024-07-16T02:00:00Z'),
    totalExposureTime: 1200,
};

export const Primary: Story = {
    args: {
        ...mockProject,
    },
};
