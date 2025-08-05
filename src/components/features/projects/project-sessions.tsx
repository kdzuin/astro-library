import { SessionData } from '@/schemas/session';
import { format } from 'date-fns';

export interface ProjectSessionsProps {
    sessions: SessionData[];
}

export function ProjectSessions({ sessions }: ProjectSessionsProps) {
    return (
        <table className="decorated-table w-full">
            <caption>Project Sessions</caption>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
            </colgroup>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Total Exposure</th>
                    <th>Notes</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sessions.map((session, index) => (
                    <tr key={index} data-testid="session-row">
                        <th>{format(session.date, 'PPP')}</th>
                        <td>0</td>
                        <td>{session.notes}</td>
                        <td></td>
                    </tr>
                ))}
                {sessions.length === 0 ? (
                    <tr data-testid="no-sessions">
                        <td colSpan={4} className="text-center p-2 bg-white">
                            No sessions
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    );
}
