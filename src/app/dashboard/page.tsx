import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <main className="space-y-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <section>
                <h2 className="text-lg font-semibold">Last activity</h2>
            </section>
            <section>
                <h2 className="text-lg font-semibold">Metrics</h2>
            </section>
            <section className="space-x-2 space-y-2">
                <h2 className="text-lg font-semibold">Actions</h2>
                <Button asChild>
                    <Link href="/projects/add">Add Project</Link>
                </Button>
                <Button asChild>
                    <Link href="/catalogues/add">Add Catalogue</Link>
                </Button>
            </section>
        </main>
    );
}
