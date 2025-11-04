import { Button } from "@/components/ui/button.tsx";
import { useSessionsByProjectQuery } from "@/hooks/use-sessions-query.ts";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, LucidePlus } from "lucide-react";

export function AllSessionsByProjectPage({ projectId }: { projectId: string }) {
    const sessionsQuery = useSessionsByProjectQuery(projectId);

    return (
        <main className="w-full min-h-screen bg-brand-gradient text-white/80  px-4 sm:px-6 lg:px-8 py-10 space-y-4">
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link to="..">
                        <ArrowLeft />
                    </Link>
                </Button>
                <div className="text-3xl md:text-4xl font-bold">
                    Sessions for the project
                </div>
            </div>
            <div className={"flex gap-2"}>
                <Button asChild size="small">
                    <Link
                        to="/dashboard/projects/$projectId/sessions/new"
                        params={{ projectId }}
                    >
                        <LucidePlus />
                        Add new session
                    </Link>
                </Button>
            </div>

            <div>Project ID: {projectId}</div>

            {sessionsQuery.isPending ? <div>Loading...</div> : null}
            {sessionsQuery.isError ? (
                <div>
                    Problem getting sessions for the project. Likely, it's the
                    network connection. Please{" "}
                    <button
                        type="button"
                        className="underline cursor-pointer"
                        onClick={() => sessionsQuery.refetch()}
                    >
                        try again
                    </button>
                    .
                </div>
            ) : null}
            {sessionsQuery.isSuccess ? (
                <div className="">
                    {sessionsQuery.data.sessions.map((session) => (
                        <div key={session.id}>
                            <Link
                                to="/dashboard/projects/$projectId/sessions/$sessionId"
                                params={{
                                    projectId: projectId,
                                    sessionId: session.id,
                                }}
                            >
                                {session.date}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : null}
        </main>
    );
}
