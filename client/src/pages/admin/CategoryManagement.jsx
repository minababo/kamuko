import CategoryManager from '../../components/admin/CategoryManager';

function CategoryManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-sm text-gray-600">
                        Organize your menu into categories
                    </p>
                </div>
            </div>

            <CategoryManager />
        </div>
    );
}

export default CategoryManagement;
