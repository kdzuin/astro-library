import { PageHeader } from '@/components/layout/page-header';

export const dynamic = 'force-dynamic';

// Server Component - runs on the server
export default async function SessionsPage() {
    return (
        <main className="space-y-6">
            <PageHeader title="My Sessions" hasBackButton />
        </main>
    );
}
