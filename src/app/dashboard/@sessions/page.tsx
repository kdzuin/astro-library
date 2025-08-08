import { Button } from '@/components/ui/button';
import { getSessionsByUserId } from '@/lib/server/actions/sessions';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function SessionsSegment() {
    const sessionsFetch = await getSessionsByUserId();
    const sessions = sessionsFetch.data;

    return (
        <div className="flex gap-2 flex-wrap">
            {sessions.map((session) => (
                <div key={session.id}>
                    <Button variant="outline" asChild size="sm">
                        <Link href={`/sessions/${session.id}`}>
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
