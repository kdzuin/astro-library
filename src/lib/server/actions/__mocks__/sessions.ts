import { fn } from 'storybook/test';

// Mock session data for testing
const mockSession = {
    id: 'session-123',
    projectId: 'project-456',
    userId: 'user-789',
    date: '2024-01-15',
};

const mockSessions = [
    mockSession,
    {
        id: 'session-124',
        projectId: 'project-456',
        userId: 'user-789',
        date: '2024-01-14',
    },
];

// Mock implementations for all session actions
export const createSession = fn().mockResolvedValue({
    success: true,
    data: { id: 'session-123' },
});

export const updateSession = fn().mockResolvedValue({
    success: true,
    data: mockSession,
});

export const deleteSession = fn().mockResolvedValue({
    success: true,
});

export const getSessionsByProjectId = fn().mockResolvedValue({
    success: true,
    data: mockSessions,
});

export const getSessionsByUserId = fn().mockResolvedValue({
    success: true,
    data: mockSessions,
});

export const getSessionById = fn().mockResolvedValue({
    success: true,
    data: mockSession,
});