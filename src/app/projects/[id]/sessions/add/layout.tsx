import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Session</CardTitle>
                    <CardDescription>
                        Create a new session to log your acquisition during the project.
                    </CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
