import AddSessionForm from '@/components/forms/add-session-form';

export default function AddSession({ params }: { params: { id: string } }) {
    return <AddSessionForm projectId={params.id} />;
}
