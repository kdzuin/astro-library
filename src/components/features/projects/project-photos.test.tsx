import { ProjectPhotos } from '@/components/features/projects/project-photos';
import { Primary } from '@/components/features/projects/project-photos.stories';
import { cleanup, render, screen } from '@/test/setup';
import { describe, expect, it, beforeEach } from 'vitest';

describe('Project Photos Render', () => {
    beforeEach(() => {
        cleanup();
    });

    it('renders project photos', () => {
        render(<ProjectPhotos {...Primary.args} />);

        expect(screen.getByTestId('project-photos')).toBeInTheDocument();
        expect(screen.getAllByRole('img')).toHaveLength(Primary.args.items.length);
    });
});
