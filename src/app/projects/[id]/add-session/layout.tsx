import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddSessionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid">
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
