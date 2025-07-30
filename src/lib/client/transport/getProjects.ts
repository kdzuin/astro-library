'use client';

import { auth } from '@/lib/client/firebase/config';
import { Project } from '@/schemas/project';

export async function getProjects(): Promise<Project[]> {
    try {
        // Get the current user's ID token
        const idToken = await auth.currentUser?.getIdToken(true);

        if (!idToken) {
            throw new Error('Authentication token not available');
        }

        // Fetch projects from the API route with the ID token
        const response = await fetch('/api/projects', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch projects');
        }

        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}
