import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddSessionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Session</CardTitle>
                    <CardDescription>
                        Log a new astronomy session to track your observations and processing.
                    </CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
