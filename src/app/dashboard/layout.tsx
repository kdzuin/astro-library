import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
    projects,
    sessions,
}: {
    projects: React.ReactNode;
    sessions: React.ReactNode;
}) {
    return (
        <main className="space-y-6">
            <PageHeader title="Dashboard" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Projects</CardTitle>
                        <CardDescription>
                            Find your latest projects here. Need to get back to something? Click on
                            it to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{projects}</CardContent>
                    <CardFooter className="border-t space-x-2">
                        <Button variant="positive" asChild>
                            <Link href="/projects/add">Add new project</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/projects">See all projects</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Sessions</CardTitle>
                        <CardDescription>
                            Your latest sessions are here. Want to review your progress or get back
                            to editing? Click on a session to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{sessions}</CardContent>
                </Card>
            </div>
        </main>
    );
}
