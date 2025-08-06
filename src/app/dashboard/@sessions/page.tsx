import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/server/auth/utils';
import { getSessionsByUserId } from '@/lib/server/transport/sessions';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function SessionsSegment() {
    const user = await requireAuth();
    const sessions = await getSessionsByUserId(user.id, 20);

    return (
        <div className="flex gap-2 flex-wrap">
            {sessions.map((session) => (
                <div key={session.id}>
                    <Button variant="outline" asChild size="sm">
                        <Link href={`/projects/${session.projectId}/sessions/${session.id}`}>
                            <Calendar />
                            {session.date}
                        </Link>
                    </Button>
                </div>
            ))}

            {sessions.length === 0 ? <p>No sessions found.</p> : null}
        </div>
    );
}
