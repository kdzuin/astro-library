import { Button } from "@/components/ui/button.tsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useProjectByIdQuery } from "@/hooks/use-projects-query.ts";
import { useSessionsByProjectQuery } from "@/hooks/use-sessions-query.ts";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, LucidePlus, LucideSearch } from "lucide-react";

export function ProjectByIdPage({ projectId }: { projectId: string }) {
    const { data: projectData } = useProjectByIdQuery(projectId);
    const { data: projectSessions } = useSessionsByProjectQuery(projectId);

    return (
        <main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link to="..">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className="text-3xl md:text-4xl font-bold">
                    {projectData?.name}
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Info</CardTitle>
                        <CardDescription>
                            Details for the project (meta information)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(projectData, null, 2)}</pre>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Project Sessions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre>{JSON.stringify(projectSessions, null, 2)}</pre>
                    </CardContent>
                    <CardFooter className="border-t flex gap-2">
                        <Button asChild size="small">
                            <Link
                                to={"/dashboard/projects/$projectId/sessions"}
                                params={{ projectId }}
                            >
                                <LucideSearch />
                                Open all session
                            </Link>
                        </Button>
                        <Button asChild size="small">
                            <Link
                                to="/dashboard/projects/$projectId/sessions/new"
                                params={{ projectId }}
                            >
                                <LucidePlus />
                                Add new session
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Project Image Gallery</CardTitle>
                        <CardDescription>
                            Finished and 'work in progress' images for the
                            project. It is nice to see the evolution of the
                            result, try to upload images as you go on with your
                            progress.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                            <picture className="aspect-square w-full rounded-2xl overflow-hidden">
                                <img
                                    src="//picsum.photos/400?1"
                                    alt="This is a test illustration"
                                    className="object-cover w-full h-full"
                                />
                            </picture>
                            <picture className="aspect-square w-full rounded-2xl overflow-hidden">
                                <img
                                    src="//picsum.photos/400?2"
                                    alt="This is a test illustration"
                                    className="object-cover w-full h-full"
                                />
                            </picture>
                            <picture className="aspect-square w-full rounded-2xl overflow-hidden">
                                <img
                                    src="//picsum.photos/400?3"
                                    alt="This is a test illustration"
                                    className="object-cover w-full h-full"
                                />
                            </picture>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t">
                        <Button>Upload new image</Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
