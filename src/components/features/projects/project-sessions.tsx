import { Session } from '@/schemas/session';
import { format } from 'date-fns';
import Link from 'next/link';

export interface ProjectSessionsProps {
    sessions: Session[];
    projectId: string;
}

export function ProjectSessions({ sessions, projectId }: ProjectSessionsProps) {
    return (
        <table className="decorated-table w-full">
            <colgroup>
                <col />
                <col width="50%" />
                <col />
            </colgroup>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sessions.map((session, index) => (
                    <tr key={index} data-testid="session-row">
                        <th>
                            <Link
                                href={`/projects/${projectId}/sessions/${session.id}`}
                                className="underline"
                            >
                                {format(session.date, 'PPP')}
                            </Link>
                        </th>
                        <td>{session.description}</td>
                        <td></td>
                    </tr>
                ))}
                {sessions.length === 0 ? (
                    <tr data-testid="no-sessions">
                        <td colSpan={3} className="text-center p-2 bg-white">
                            No sessions
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    );
}
