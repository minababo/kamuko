import { UserCircleIcon } from '@heroicons/react/24/outline';

function ProfileHeader({ user }) {
    // Generate initials from username
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Format member since date
    const formatMemberSince = (date) => {
        if (!date) return 'Recently';
        const memberDate = new Date(date);
        return memberDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {getInitials(user.username)}
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                    <p className="mt-1 text-gray-600">{user.email}</p>
                    <p className="mt-1 text-sm text-gray-500">
                        Member since {formatMemberSince(user.createdAt)}
                    </p>
                </div>

                {/* Badge (optional) */}
                {user.role === 'admin' && (
                    <div className="rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700">
                        Admin
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileHeader;
