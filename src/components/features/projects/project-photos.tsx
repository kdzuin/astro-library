export interface PhotoItem {
    id: string;
    fullSizeUrl: string;
    thumbnailUrl: string;
    name: string;
    alt: string;
    description?: string;
}

export interface ProjectPhotosProps {
    items: PhotoItem[];
}

export const ProjectPhotos = ({ items }: ProjectPhotosProps) => {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="project-photos"
        >
            {items.map((item) => (
                <ProjectPhoto key={item.id} item={item} />
            ))}
        </div>
    );
};

export const ProjectPhoto = ({ item }: { item: PhotoItem }) => {
    return (
        <figure data-testid="project-photo">
            <img src={item.thumbnailUrl} alt={item.alt} />
            <figcaption>
                <p>
                    <strong>{item.name}</strong>
                </p>
                {item.description}
            </figcaption>
        </figure>
    );
};
