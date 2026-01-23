import MenuItemTable from '../../components/admin/MenuItemTable';

function MenuManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-sm text-gray-600">
                        Manage your products and availability
                    </p>
                </div>
            </div>

            <MenuItemTable />
        </div>
    );
}

export default MenuManagement;
