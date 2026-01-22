import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function ProfileTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'account', label: 'Account', icon: UserIcon },
        { id: 'password', label: 'Password', icon: LockClosedIcon },
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Profile tabs">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${isActive
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

export default ProfileTabs;
