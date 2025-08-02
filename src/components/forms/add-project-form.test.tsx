import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AddProjectForm from './add-project-form';
import userEvent from '@testing-library/user-event';

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('AddProjectForm', () => {
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useRouter).mockReturnValue({
            push: mockPush,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // Mock successful API response
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: { id: 'test-project-id' } }),
        } as Response);
    });

    afterEach(() => {
        cleanup(); // Ensure DOM is cleared between tests
    });

    describe('Component Rendering', () => {
        it('renders the form without errors', async () => {
            render(<AddProjectForm />);
            expect(screen.getByTestId('add-project-form')).toBeInTheDocument();
            expect(screen.getByTestId('submit-button')).toBeInTheDocument();
            expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
            expect(screen.queryByTestId('global-error-message')).not.toBeInTheDocument();
        });
    });

    describe('Form Submission', () => {
        it('submits the form successfully', async () => {
            render(<AddProjectForm />);

            const user = userEvent.setup();

            const projectNameInput = screen.getByTestId('project-name-input');
            const submitButton = screen.getByTestId('submit-button');

            await user.type(projectNameInput, 'Test Project');
            await user.click(submitButton);

            // Wait for the API call and navigation
            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith(
                    '/api/projects',
                    expect.objectContaining({
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                );
            });

            // Wait for navigation to occur
            await waitFor(() => {
                expect(mockPush).toHaveBeenCalledWith('/projects');
            });
        });

        it('shows error when required fields are not filled', async () => {
            render(<AddProjectForm />);

            const user = userEvent.setup();
            const submitButton = screen.getByTestId('submit-button');

            await user.click(submitButton);
            
            await waitFor(() => {
                const errorMessages = screen.getAllByTestId('error-message');
                expect(errorMessages.length).toBeGreaterThanOrEqual(1);
            });
        });
    });
});
