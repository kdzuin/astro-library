import AddSessionForm from '@/components/forms/add-session-form';
import { Modal } from '@/components/modals/modal';

export default function AddSessionModal({ params }: { params: { id: string } }) {
    return (
        <Modal
            title="Create New Session"
            description="Create a new session to log your acquisition during the project."
        >
            <AddSessionForm projectId={params.id} />
        </Modal>
    );
}
