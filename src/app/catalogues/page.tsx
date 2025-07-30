import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Book, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { requireAuth } from '@/lib/server/auth/utils';
import { getDb } from '@/lib/server/firebase/firestore';
import { Catalogue } from '@/schemas/catalogue';

async function getCatalogues(): Promise<{ publicCatalogues: Catalogue[], privateCatalogues: Catalogue[] }> {
    try {
        const user = await requireAuth();
        const db = await getDb();
        
        // Get all catalogues
        const cataloguesRef = db.collection('catalogues');
        const snapshot = await cataloguesRef.orderBy('name', 'asc').get();
        
        const allCatalogues: Catalogue[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Catalogue;
        });
        
        // Separate public (system) and private (user) catalogues
        const publicCatalogues = allCatalogues.filter(cat => cat.type === 'system');
        const privateCatalogues = allCatalogues.filter(cat => cat.type === 'user' && cat.userId === user.id);
        
        return { publicCatalogues, privateCatalogues };
    } catch (error) {
        console.error('Error fetching catalogues:', error);
        return { publicCatalogues: [], privateCatalogues: [] };
    }
}

function CatalogueCard({ catalogue }: { catalogue: Catalogue }) {
    const isPublic = catalogue.type === 'system';
    
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                            {isPublic ? (
                                <Globe className="h-4 w-4 text-blue-500" />
                            ) : (
                                <User className="h-4 w-4 text-green-500" />
                            )}
                            <Link
                                href={`/catalogues/${catalogue.id}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {catalogue.name}
                            </Link>
                        </CardTitle>
                        {catalogue.description && (
                            <CardDescription className="text-sm">
                                {catalogue.description}
                            </CardDescription>
                        )}
                    </div>
                    <Badge variant={isPublic ? "default" : "secondary"}>
                        {isPublic ? "System" : "Personal"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Catalogue details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Book className="h-3 w-3" />
                            <span>{catalogue.abbreviation}</span>
                        </div>
                        {catalogue.objectCount !== undefined && (
                            <div>
                                {catalogue.objectCount} objects
                            </div>
                        )}
                    </div>
                    
                    {/* Prefix info */}
                    {catalogue.prefix && (
                        <div className="text-xs text-muted-foreground">
                            Prefix: {catalogue.prefix}
                        </div>
                    )}
                    
                    {/* Last updated */}
                    <div className="text-xs text-muted-foreground">
                        Updated {catalogue.updatedAt.toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default async function CataloguesPage() {
    const { publicCatalogues, privateCatalogues } = await getCatalogues();
    
    return (
        <main className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Catalogues</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse astronomical catalogues and create your own custom collections
                    </p>
                </div>
                <Button asChild>
                    <Link href="/catalogues/add">
                        <Plus className="mr-2 h-4 w-4" />
                        New Catalogue
                    </Link>
                </Button>
            </div>
            
            {/* Public/System Catalogues Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <h2 className="text-2xl font-semibold">System Catalogues</h2>
                    <Badge variant="outline">{publicCatalogues.length}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                    Standard astronomical catalogues like NGC, Messier, and Caldwell
                </p>
                
                {publicCatalogues.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50 text-blue-500" />
                            <h3 className="text-lg font-medium">No system catalogues available</h3>
                            <p className="text-sm text-muted-foreground">
                                System catalogues will be added by administrators
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicCatalogues.map((catalogue) => (
                            <CatalogueCard key={catalogue.id} catalogue={catalogue} />
                        ))}
                    </div>
                )}
            </section>
            
            {/* Private/User Catalogues Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-500" />
                    <h2 className="text-2xl font-semibold">My Catalogues</h2>
                    <Badge variant="outline">{privateCatalogues.length}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                    Your personal catalogues for organizing custom object lists
                </p>
                
                {privateCatalogues.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-muted-foreground">
                                <User className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                                <h3 className="text-lg font-medium">No personal catalogues yet</h3>
                                <p className="text-sm mb-4">
                                    Create your first custom catalogue to organize your favorite objects
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/catalogues/add">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Catalogue
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {privateCatalogues.map((catalogue) => (
                            <CatalogueCard key={catalogue.id} catalogue={catalogue} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
