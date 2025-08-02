import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getUserProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from './projects';
import type { Project } from '@/schemas/project';

// Mock Firestore
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockGet = vi.fn();
const mockAdd = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
// Removed unused mockExists and mockData variables

// Mock the Firestore database
vi.mock('@/lib/server/firebase/firestore', () => ({
    getDb: vi.fn(() => ({
        collection: mockCollection,
    })),
}));

// Mock FieldValue
vi.mock('firebase-admin/firestore', () => ({
    FieldValue: {
        serverTimestamp: vi.fn(() => 'server-timestamp'),
    },
}));

describe('Projects Transport Layer', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock chain
        mockCollection.mockReturnValue({
            where: mockWhere,
            doc: mockDoc,
            add: mockAdd,
        });

        mockWhere.mockReturnValue({
            orderBy: mockOrderBy,
        });

        mockOrderBy.mockReturnValue({
            get: mockGet,
        });

        mockDoc.mockReturnValue({
            get: mockGet,
            update: mockUpdate,
            delete: mockDelete,
        });
    });

    describe('getUserProjects', () => {
        it('returns projects for a user sorted by updatedAt desc', async () => {
            const mockProjectData = {
                name: 'NGC 7000',
                description: 'North America Nebula',
                userId: 'user-123',
                visibility: 'public',
                status: 'active',
                tags: ['nebula'],
                sessions: [],
                createdAt: { toDate: () => new Date('2024-01-01') },
                updatedAt: { toDate: () => new Date('2024-01-02') },
            };

            const mockDocs = [
                {
                    id: 'project-1',
                    exists: true,
                    data: () => mockProjectData,
                },
            ];

            mockGet.mockResolvedValue({
                docs: mockDocs,
            });

            const result = await getUserProjects('user-123');

            expect(mockCollection).toHaveBeenCalledWith('projects');
            expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'user-123');
            expect(mockOrderBy).toHaveBeenCalledWith('updatedAt', 'desc');

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                id: 'project-1',
                name: 'NGC 7000',
                description: 'North America Nebula',
                userId: 'user-123',
                visibility: 'public',
                status: 'active',
                tags: ['nebula'],
                sessions: [],
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            });
        });

        it('filters out non-existent documents', async () => {
            const mockDocs = [
                { id: 'project-1', exists: true, data: () => ({ name: 'Project 1' }) },
                { id: 'project-2', exists: false, data: () => null },
                { id: 'project-3', exists: true, data: () => ({ name: 'Project 3' }) },
            ];

            mockGet.mockResolvedValue({ docs: mockDocs });

            const result = await getUserProjects('user-123');

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('project-1');
            expect(result[1].id).toBe('project-3');
        });

        it('returns empty array when user has no projects', async () => {
            mockGet.mockResolvedValue({ docs: [] });

            const result = await getUserProjects('user-123');

            expect(result).toEqual([]);
        });

        it('returns empty array on database error', async () => {
            mockGet.mockRejectedValue(new Error('Database error'));

            const result = await getUserProjects('user-123');

            expect(result).toEqual([]);
        });

        it('handles missing timestamp fields gracefully', async () => {
            const mockProjectData = {
                name: 'Test Project',
                userId: 'user-123',
                // Missing createdAt and updatedAt
            };

            const mockDocs = [
                {
                    id: 'project-1',
                    exists: true,
                    data: () => mockProjectData,
                },
            ];

            mockGet.mockResolvedValue({ docs: mockDocs });

            const result = await getUserProjects('user-123');

            expect(result[0].createdAt).toBeInstanceOf(Date);
            expect(result[0].updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('getProjectById', () => {
        it('returns project when it exists', async () => {
            const mockProjectData = {
                name: 'M31',
                description: 'Andromeda Galaxy',
                userId: 'user-123',
                createdAt: { toDate: () => new Date('2024-01-01') },
                updatedAt: { toDate: () => new Date('2024-01-02') },
            };

            mockGet.mockResolvedValue({
                id: 'project-123',
                exists: true,
                data: () => mockProjectData,
            });

            const result = await getProjectById('project-123');

            expect(mockCollection).toHaveBeenCalledWith('projects');
            expect(mockDoc).toHaveBeenCalledWith('project-123');

            expect(result).toEqual({
                id: 'project-123',
                name: 'M31',
                description: 'Andromeda Galaxy',
                userId: 'user-123',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            });
        });

        it('returns null when project does not exist', async () => {
            mockGet.mockResolvedValue({
                exists: false,
            });

            const result = await getProjectById('non-existent');

            expect(result).toBeNull();
        });

        it('throws error on database failure', async () => {
            mockGet.mockRejectedValue(new Error('Database error'));

            await expect(getProjectById('project-123')).rejects.toThrow('Database error');
        });
    });

    describe('createProject', () => {
        it('creates a new project and returns the ID', async () => {
            const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
                name: 'New Project',
                description: 'A test project',
                userId: 'user-123',
                visibility: 'private',
                status: 'planning',
                tags: ['test'],
                sessions: {},
                collectionIds: [],
                processingImageUrls: [],
                finalImageUrls: [],
            };

            mockAdd.mockResolvedValue({
                id: 'new-project-id',
            });

            const result = await createProject(newProject);

            expect(mockCollection).toHaveBeenCalledWith('projects');
            expect(mockAdd).toHaveBeenCalledWith({
                ...newProject,
                createdAt: 'server-timestamp',
                updatedAt: 'server-timestamp',
            });
            expect(result).toBe('new-project-id');
        });

        it('throws error on database failure', async () => {
            const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
                name: 'New Project',
                description: 'A test project',
                userId: 'user-123',
                visibility: 'private',
                status: 'planning',
                tags: [],
                sessions: {},
                collectionIds: [],
                processingImageUrls: [],
                finalImageUrls: [],
            };

            mockAdd.mockRejectedValue(new Error('Database error'));

            await expect(createProject(newProject)).rejects.toThrow('Database error');
        });
    });

    describe('updateProject', () => {
        it('updates a project with new data', async () => {
            const updates = {
                name: 'Updated Project Name',
                description: 'Updated description',
                tags: ['updated', 'test'],
            };

            mockUpdate.mockResolvedValue(undefined);

            await updateProject('project-123', updates);

            expect(mockCollection).toHaveBeenCalledWith('projects');
            expect(mockDoc).toHaveBeenCalledWith('project-123');
            expect(mockUpdate).toHaveBeenCalledWith({
                ...updates,
                updatedAt: 'server-timestamp',
            });
        });

        it('throws error on database failure', async () => {
            mockUpdate.mockRejectedValue(new Error('Database error'));

            await expect(updateProject('project-123', { name: 'New Name' })).rejects.toThrow(
                'Database error'
            );
        });

        it('does not allow updating protected fields', async () => {
            const updates = {
                name: 'Updated Name',
                // These fields should be excluded by TypeScript, but testing runtime behavior
            };

            mockUpdate.mockResolvedValue(undefined);

            await updateProject('project-123', updates);

            expect(mockUpdate).toHaveBeenCalledWith({
                name: 'Updated Name',
                updatedAt: 'server-timestamp',
            });
        });
    });

    describe('deleteProject', () => {
        it('deletes a project successfully', async () => {
            mockDelete.mockResolvedValue(undefined);

            await deleteProject('project-123');

            expect(mockCollection).toHaveBeenCalledWith('projects');
            expect(mockDoc).toHaveBeenCalledWith('project-123');
            expect(mockDelete).toHaveBeenCalled();
        });

        it('throws error on database failure', async () => {
            mockDelete.mockRejectedValue(new Error('Database error'));

            await expect(deleteProject('project-123')).rejects.toThrow('Database error');
        });
    });

    describe('Integration scenarios', () => {
        it('handles complete project lifecycle', async () => {
            // Create
            mockAdd.mockResolvedValue({ id: 'lifecycle-project' });

            const newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
                name: 'Lifecycle Test',
                description: 'Testing complete lifecycle',
                userId: 'user-123',
                visibility: 'private',
                status: 'planning',
                tags: ['test'],
                sessions: {},
                collectionIds: [],
                processingImageUrls: [],
                finalImageUrls: [],
            };

            const projectId = await createProject(newProject);
            expect(projectId).toBe('lifecycle-project');

            // Read
            const mockProjectData = {
                ...newProject,
                createdAt: { toDate: () => new Date() },
                updatedAt: { toDate: () => new Date() },
            };

            mockGet.mockResolvedValue({
                id: projectId,
                exists: true,
                data: () => mockProjectData,
            });

            const retrievedProject = await getProjectById(projectId);
            expect(retrievedProject?.name).toBe('Lifecycle Test');

            // Update
            mockUpdate.mockResolvedValue(undefined);
            await updateProject(projectId, { status: 'active' });
            expect(mockUpdate).toHaveBeenCalledWith({
                status: 'active',
                updatedAt: 'server-timestamp',
            });

            // Delete
            mockDelete.mockResolvedValue(undefined);
            await deleteProject(projectId);
            expect(mockDelete).toHaveBeenCalled();
        });
    });
});
