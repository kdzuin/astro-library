import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                    <CardDescription>
                        Start a new astronomy project to track your observations and processing.
                    </CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
