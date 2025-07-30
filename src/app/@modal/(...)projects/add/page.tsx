import AddProjectForm from '@/app/projects/add/page';
import { Modal } from '@/components/modals/modal';

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
