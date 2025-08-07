import AddProjectForm from '@/components/forms/add-project-form';
import { Modal } from '@/components/modals/modal';
export const dynamic = 'force-dynamic';

export default function AddProjectModal() {
    return (
        <Modal
            title="Create New Project"
            description="Start a new astronomy project to track your observations and processing."
        >
            <AddProjectForm />
        </Modal>
    );
}
