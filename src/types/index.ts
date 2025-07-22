// User type
export interface User {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: Date;
}

// Project type
export interface Project {
    id: string;
    userId: string;
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    coverImageUrl?: string;
    visibility: 'private' | 'public';
}
