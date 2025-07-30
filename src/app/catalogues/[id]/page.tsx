import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Book, Globe, User, Edit } from 'lucide-react';
import Link from 'next/link';
import { requireAuth } from '@/lib/server/auth/utils';
import { getDb } from '@/lib/server/firebase/firestore';
import { Catalogue } from '@/schemas/catalogue';
import { notFound } from 'next/navigation';

async function getCatalogue(id: string): Promise<Catalogue | null> {
    try {
        const user = await requireAuth();
        const db = await getDb();
        
        const catalogueRef = db.collection('catalogues').doc(id);
        const doc = await catalogueRef.get();
        
        if (!doc.exists) {
            return null;
        }
        
        const catalogueData = doc.data();
        if (!catalogueData) {
            return null;
        }
        
        // Check if user has access to this catalogue
        const isSystem = catalogueData.type === 'system';
        const isOwner = catalogueData.type === 'user' && catalogueData.userId === user.id;
        
        if (!isSystem && !isOwner) {
            return null; // User doesn't have access
        }
        
        return {
            id: doc.id,
            ...catalogueData,
            createdAt: catalogueData.createdAt?.toDate() || new Date(),
            updatedAt: catalogueData.updatedAt?.toDate() || new Date(),
        } as Catalogue;
    } catch (error) {
        console.error('Error fetching catalogue:', error);
        return null;
    }
}

export default async function CataloguePage({ params }: { params: { id: string } }) {
    const catalogue = await getCatalogue(params.id);
    
    if (!catalogue) {
        notFound();
    }
    
    const isSystem = catalogue.type === 'system';
    const user = await requireAuth();
    const canEdit = !isSystem && catalogue.userId === user.id;
    
    return (
        <main className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/catalogues">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Catalogues
                    </Link>
                </Button>
            </div>
            
            {/* Catalogue Info */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {isSystem ? (
                                    <Globe className="h-5 w-5 text-blue-500" />
                                ) : (
                                    <User className="h-5 w-5 text-green-500" />
                                )}
                                <CardTitle className="text-2xl">{catalogue.name}</CardTitle>
                                <Badge variant={isSystem ? "default" : "secondary"}>
                                    {isSystem ? "System" : "Personal"}
                                </Badge>
                            </div>
                            {catalogue.description && (
                                <CardDescription className="text-base">
                                    {catalogue.description}
                                </CardDescription>
                            )}
                        </div>
                        {canEdit && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/catalogues/${catalogue.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Abbreviation</div>
                            <div className="flex items-center gap-2">
                                <Book className="h-4 w-4" />
                                <span className="font-mono">{catalogue.abbreviation}</span>
                            </div>
                        </div>
                        
                        {catalogue.prefix && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Object Prefix</div>
                                <div className="font-mono">{catalogue.prefix}</div>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Object Count</div>
                            <div>{catalogue.objectCount || 0} objects</div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Created</div>
                            <div>{catalogue.createdAt.toLocaleDateString()}</div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                            <div>{catalogue.updatedAt.toLocaleDateString()}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            {/* Objects Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Catalogue Objects</CardTitle>
                    <CardDescription>
                        Objects in this catalogue {catalogue.objectCount ? `(${catalogue.objectCount} total)` : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Object management coming soon</h3>
                        <p className="text-sm">
                            The ability to add and manage objects within catalogues will be implemented in a future update.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
