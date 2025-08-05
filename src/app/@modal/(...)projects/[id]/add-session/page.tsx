import AddSessionForm from '@/app/projects/[id]/add-session/page';
import { Modal } from '@/components/modals/modal';

export default function AddSessionModal({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Modal
            title="Create New Session"
            description="Create a new session to log your acquisition during the project."
        >
            <AddSessionForm params={params} />
        </Modal>
    );
}
