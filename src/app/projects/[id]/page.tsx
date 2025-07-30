'use client';

import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Project } from '@/schemas/project';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const project: Project = {
        id: id,
        userId: 'asdf',
        name: 'Project name',
        createdAt: new Date(),
        updatedAt: new Date(),
        visibility: 'private',
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Button asChild variant="outline" size="sm">
                    <Link href="/projects">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Projects
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{id}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild variant="outline">
                        <Link href={`/projects/${project.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Project
                        </Link>
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Project
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    project <strong>&quot;{project.name}&quot;</strong> and all of
                                    its associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button variant="destructive" asChild>
                                    <AlertDialogAction>Delete Project</AlertDialogAction>
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
}
