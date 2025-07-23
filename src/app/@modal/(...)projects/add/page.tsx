import AddProjectForm from '@/app/projects/add/page';
import { Modal } from '@/components/modals/modal';

export default function AddProjectModal() {
    return (
        <Modal title="Add Project">
            <AddProjectForm />
        </Modal>
    );
}
