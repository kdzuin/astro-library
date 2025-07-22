import { AddProjectForm } from '@/components/forms/add-project-form';
import { Modal } from '@/components/modals/modal';

export default function AddProjectModal() {
    return (
        <Modal title="Add Project">
            <AddProjectForm />
        </Modal>
    );
}
