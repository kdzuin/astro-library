import AddSessionForm from '@/components/forms/add-session-form';

export default async function AddSession({ params }: { params: Promise<{ id: string }> }) {
    const projectId = (await params).id;
    return <AddSessionForm projectId={projectId} />;
}
