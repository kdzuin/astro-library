import { ProjectPhotos, ProjectPhotosProps } from '@/components/features/projects/project-photos';
import { Meta } from '@storybook/nextjs-vite';

export default {
    title: 'Features/Projects/Project Photos',
    component: ProjectPhotos,
    parameters: {
        layout: 'centered',
    },
} as Meta<ProjectPhotosProps>;

export const Primary = {
    args: {
        items: [
            {
                id: '1',
                fullSizeUrl: 'https://placehold.co/600x400',
                thumbnailUrl: 'https://placehold.co/150x150',
                name: 'Photo 1',
                description: 'Description 1',
            },
            {
                id: '2',
                fullSizeUrl: 'https://placehold.co/600x400',
                thumbnailUrl: 'https://placehold.co/150x150',
                name: 'Photo 2',
                description: 'Description 2',
            },
            {
                id: '3',
                fullSizeUrl: 'https://placehold.co/600x400',
                thumbnailUrl: 'https://placehold.co/150x150',
                name: 'Photo 3',
                description: 'Description 3',
            },
        ],
    },
};
