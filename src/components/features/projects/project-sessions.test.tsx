import { ProjectSessions } from '@/components/features/projects/project-sessions';
import { Empty, Primary } from '@/components/features/projects/project-sessions.stories';
import { cleanup, render, screen } from '@/test/setup';
import { describe, expect, it, beforeEach } from 'vitest';

describe('Project Sessions Render', () => {
    beforeEach(() => {
        cleanup();
    });

    it('renders project sessions table with rows', () => {
        render(<ProjectSessions sessions={Primary.args?.sessions || {}} />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByTestId('session-row')).toHaveLength(
            Object.keys(Primary.args?.sessions || {}).length
        );
    });

    it('renders project sessions table with no rows', () => {
        render(<ProjectSessions sessions={Empty.args?.sessions || {}} />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.queryAllByTestId('session-row')).toHaveLength(0);
        expect(screen.getByTestId('no-sessions')).toBeInTheDocument();
    });
});
