import { HeatMap } from "@/components/dashboard/heat-map";
import { ProjectList } from "@/components/molecules/project-list";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useProjectsByUserQuery } from "@/hooks/use-projects-query.ts";
import { useSessionsByUserQuery } from "@/hooks/use-sessions-query.ts";
import { Link } from "@tanstack/react-router";
import { LucideArrowLeft, LucidePlus, LucideSearch } from "lucide-react";
import { useMemo } from "react";

interface DashboardPageProps {
    userId: string;
}

export function DashboardPage({ userId }: DashboardPageProps) {
    const projectsQuery = useProjectsByUserQuery(userId);
    const sessionsQuery = useSessionsByUserQuery(userId);

    const preparedHeatmapData = useMemo(() => {
        if (sessionsQuery.isSuccess) {
            return sessionsQuery.data.sessions.map((session) => ({
                date: session.date,
                value: Math.floor(Math.random() * 100) + 1,
            }));
        }

        return [];
    }, [sessionsQuery.data, sessionsQuery.isSuccess]);

    return (
        <main className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-4">
            <div className="flex items-center gap-4">
                <Button asChild variant="modest" size="icon">
                    <Link to="..">
                        <LucideArrowLeft />
                    </Link>
                </Button>
                <div className="text-3xl md:text-4xl font-bold">Dashboard</div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Heatmap</CardTitle>
                        <CardDescription>
                            Heatmap for the last 26 weeks in total exposure time
                            per calendar day.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HeatMap
                            data={preparedHeatmapData}
                            numberOfWeeks={26}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Last Projects</CardTitle>
                        <CardDescription>
                            Your most recently updated astrophotography
                            projects.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {projectsQuery.isSuccess ? (
                            <ProjectList
                                projects={projectsQuery.data.projects || []}
                                variant="simple"
                            />
                        ) : null}
                    </CardContent>
                    <CardFooter className="border-t flex gap-2">
                        <Button asChild size="small">
                            <Link to="/dashboard/projects">
                                <LucideSearch />
                                Open all projects
                            </Link>
                        </Button>
                        <Button asChild size="small">
                            <Link to="/dashboard/projects/new">
                                <LucidePlus />
                                Add new project
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}
