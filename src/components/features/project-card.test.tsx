import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './project-card';
import type { Project } from '@/schemas/project';

// Sample test data
const mockProject: Project = {
    id: 'test-project-1',
    userId: 'user-123',
    name: 'NGC 7000 - North America Nebula',
    description: 'A large emission nebula in the constellation Cygnus, near Deneb.',
    visibility: 'public',
    status: 'active',
    catalogueDesignation: 'NGC7000',
    collectionIds: [],
    tags: [],
    processingImageUrls: [],
    finalImageUrls: [],
    sessions: {
        '2024-07-15': {
            date: '2024-07-15',
            location: 'Dark Sky Site',
            equipmentIds: [],
            tags: [],
            filters: [
                {
                    name: 'Ha',
                    exposureTime: 300,
                    frameCount: 12,
                },
                {
                    name: 'OIII',
                    exposureTime: 300,
                    frameCount: 12,
                },
            ],
        },
    },
    createdAt: new Date('2024-07-01T10:00:00Z'),
    updatedAt: new Date('2024-07-16T02:00:00Z'),
};

describe('ProjectCard', () => {
    render(<ProjectCard project={mockProject} />);

    it('renders project name and description', () => {
        expect(screen.getByText(mockProject.name)).toBeInTheDocument();
        expect(screen.getByText(mockProject.description!)).toBeInTheDocument();
    });

    it('shows project status badge', () => {
        const badge = screen.getByTestId('project-status');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent('Active');
    });
});
