import { ProjectSessions as ProjectSessionsType } from '@/schemas/project';

export function ProjectSessions({ sessions }: { sessions: ProjectSessionsType }) {
    return (
        <table className="w-full">
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
                {Object.entries(sessions).map(([date, session]) => (
                    <tr key={date} data-testid="session-row">
                        <th>{new Date(date).toLocaleDateString()}</th>
                        <td>0</td>
                        <td>{session.notes}</td>
                        <td></td>
                    </tr>
                ))}
                {Object.keys(sessions).length === 0 ? (
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
