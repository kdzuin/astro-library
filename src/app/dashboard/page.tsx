import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <main className="space-y-6">
            <PageHeader title="Dashboard" />
            <section className="space-x-2 space-y-2">
                <Button asChild>
                    <Link href="/projects/add">Add Project</Link>
                </Button>
            </section>
        </main>
    );
}
