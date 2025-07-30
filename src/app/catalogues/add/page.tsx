import AddCatalogueForm from '@/components/forms/add-catalogue-form';

export default function AddCatalogue() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Catalogue</h1>
                <p className="text-muted-foreground">
                    Create a custom catalogue to organize your favorite astronomical objects.
                </p>
            </div>
            <AddCatalogueForm />
        </div>
    );
}
