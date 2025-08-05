import { describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@/test/setup';
import { ProjectCard } from '@/components/features/projects/project-card';
import type { Project } from '@/schemas/project';
import { Primary } from './project-card.stories';

// Sample test data
const mockProject: Project = Primary.args as Project;

describe('ProjectCard Render', () => {
    cleanup();
    render(<ProjectCard {...mockProject} />);

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

describe('ProjectCard Session Stats', () => {
    cleanup();
    render(<ProjectCard {...mockProject} />);

    it('shows total time in minutes', () => {
        // exposure time is in seconds, we need minutes in the end
        const totalTimeBadge = screen.getByTestId('total-exposure-time');

        expect(totalTimeBadge).toBeInTheDocument();
        expect(totalTimeBadge).not.toHaveTextContent(mockProject.totalExposureTime);
        expect(totalTimeBadge).toHaveTextContent(Math.ceil(mockProject.totalExposureTime / 60));
    });
});
