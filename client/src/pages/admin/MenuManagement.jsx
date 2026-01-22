import { useState } from 'react';
import MenuItemTable from '../../components/admin/MenuItemTable';
import CategoryManager from '../../components/admin/CategoryManager';

function MenuManagement() {
    const [activeTab, setActiveTab] = useState('items');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
                    <p className="text-sm text-gray-600">
                        Manage your menu items and categories
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('items')}
                        className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'items'
                                ? 'border-orange-600 text-orange-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        Menu Items
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('categories')}
                        className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'categories'
                                ? 'border-orange-600 text-orange-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                    >
                        Categories
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'items' && <MenuItemTable />}
                {activeTab === 'categories' && <CategoryManager />}
            </div>
        </div>
    );
}

export default MenuManagement;
