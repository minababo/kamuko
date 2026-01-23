import { useEffect, useState } from 'react';
import api from '../../utils/api';

const ROLE_OPTIONS = [
    { value: 'customer', label: 'Customer' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
];

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get('/users');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (userId, role) => {
        try {
            setUpdatingId(userId);
            const response = await api.patch(`/users/${userId}/role`, { role });
            const updated = response.data;
            setUsers((prev) =>
                prev.map((user) => (user._id === userId ? { ...user, role: updated.role } : user))
            );
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
                <p className="text-sm text-gray-600">
                    Assign staff roles to registered users.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Role
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-6 py-8 text-center text-sm text-gray-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {user.name || user.username || 'Unnamed'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {user.username || '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(event) =>
                                                handleRoleChange(user._id, event.target.value)
                                            }
                                            disabled={updatingId === user._id}
                                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
                                        >
                                            {ROLE_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;
