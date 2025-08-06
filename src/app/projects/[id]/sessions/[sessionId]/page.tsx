import { requireAuth } from '@/lib/server/auth/utils';
import { getProjectById } from '@/lib/server/transport/projects';
import { getSessionById } from '@/lib/server/transport/sessions';
import SessionDetailsClient from './session-details-client';
import { notFound } from 'next/navigation';

export default async function SessionPage({ 
    params 
}: { 
    params: Promise<{ id: string; sessionId: string }> 
}) {
    const { id: projectId, sessionId } = await params;
    
    try {
        // Server-side authentication and data fetching
        const user = await requireAuth();
        
        // Verify project belongs to user
        const project = await getProjectById(projectId);
        if (!project || project.userId !== user.id) {
            notFound();
        }

        // Get session with acquisition details
        const sessionWithDetails = await getSessionById(projectId, sessionId);
        if (!sessionWithDetails) {
            notFound();
        }

        return (
            <div className="container mx-auto py-6">
                <SessionDetailsClient 
                    projectId={projectId} 
                    sessionId={sessionId}
                    initialData={{
                        projectName: project.name,
                        sessionDate: sessionWithDetails.date,
                        acquisitionDetails: sessionWithDetails.acquisitionDetails || []
                    }}
                />
            </div>
        );
    } catch (error) {
        console.error('Error loading session page:', error);
        notFound();
    }
}
