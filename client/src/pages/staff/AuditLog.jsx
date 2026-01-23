import { useCallback, useMemo, useState, useEffect } from 'react'
import api from '../../utils/api'
import { useAuth } from '../../hooks/useAuth'

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'action-asc', label: 'Action A-Z' },
    { value: 'actor-asc', label: 'Actor A-Z' },
]

function AuditLog() {
    const { user } = useAuth()
    const canManage = ['manager', 'admin'].includes(user?.role)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [sortBy, setSortBy] = useState('newest')

    const fetchLogs = useCallback(async () => {
        if (!canManage) return
        try {
            setLoading(true)
            setError(null)
            const response = await api.get('/audit-logs')
            setLogs(Array.isArray(response.data) ? response.data : [])
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load audit logs')
        } finally {
            setLoading(false)
        }
    }, [canManage])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const sortedLogs = useMemo(() => {
        const list = [...logs]
        switch (sortBy) {
            case 'oldest':
                return list.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                )
            case 'action-asc':
                return list.sort((a, b) =>
                    String(a.action || '').localeCompare(String(b.action || ''))
                )
            case 'actor-asc':
                return list.sort((a, b) =>
                    String(a.actor?.name || '').localeCompare(String(b.actor?.name || ''))
                )
            case 'newest':
            default:
                return list.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
        }
    }, [logs, sortBy])

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                    <p className="text-sm text-gray-600">
                        Track changes made by staff across the system.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={fetchLogs}
                        disabled={!canManage || loading}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {!canManage && (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
                    Audit log access is limited to managers and admins.
                </div>
            )}

            {canManage && (
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {!error && sortedLogs.length === 0 && !loading && (
                        <p className="text-sm text-gray-500">No audit activity yet.</p>
                    )}
                    {sortedLogs.length > 0 && (
                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-100 text-sm">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Actor</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                        <th className="px-4 py-3 text-left">Entity</th>
                                        <th className="px-4 py-3 text-left">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sortedLogs.map((log) => (
                                        <tr key={log._id}>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">
                                                    {log.actor?.name || 'Unknown'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {log.actor?.role || '—'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {log.action}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {log.entityType || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AuditLog
