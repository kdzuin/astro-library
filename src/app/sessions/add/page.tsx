import AddSessionForm from '@/components/forms/add-session-form';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AddSession({
    searchParams,
}: {
    searchParams: Promise<{ projectId?: string }>;
}) {
    const { projectId } = await searchParams;

    // Redirect to projects page if no projectId is provided
    if (!projectId) {
        redirect('/projects');
    }

    return <AddSessionForm projectId={projectId} />;
}
