import { PageHeader } from '@/components/layout/page-header';
import { getSessionById } from '@/lib/server/actions/sessions';
import { notFound } from 'next/navigation';

export default async function SessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const sessionId = (await params).sessionId;
    const sessionFetch = await getSessionById(sessionId);
    const session = sessionFetch.data;

    if (!session) {
        return notFound();
    }

    return (
        <main className="space-y-6">
            <PageHeader hasBackButton title={session.date} />
        </main>
    );
}
