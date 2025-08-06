import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

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
                <section>{projects}</section>
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Sessions</CardTitle>
                        <CardDescription>
                            Last 20 sessions from all of your projects directly linked to each
                            activity.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>{sessions}</CardContent>
                </Card>
            </div>
        </main>
    );
}
