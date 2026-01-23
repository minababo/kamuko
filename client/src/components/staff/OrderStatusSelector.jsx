import { useState } from 'react';

function OrderStatusSelector({ currentStatus, orderId, onStatusChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const statusTransitions = {
        placed: [
            { value: 'preparing', label: 'Accept & Start Prep', color: 'text-blue-600' },
            { value: 'cancelled', label: 'Cancel Order', color: 'text-red-600' },
        ],
        preparing: [{ value: 'ready', label: 'Mark Ready', color: 'text-green-600' }],
        ready: [{ value: 'completed', label: 'Complete Order', color: 'text-gray-600' }],
        completed: [],
        cancelled: [],
    };

    const normalizedStatus = currentStatus === 'pending' ? 'placed' : currentStatus;
    const validNextStatuses = statusTransitions[normalizedStatus] || [];

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        try {
            await onStatusChange(orderId, newStatus);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (validNextStatuses.length === 0) {
        return null;
    }

    // If only one action, show as button
    if (validNextStatuses.length === 1) {
        const action = validNextStatuses[0];
        return (
            <button
                type="button"
                onClick={() => handleStatusChange(action.value)}
                disabled={isUpdating}
                className={`flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 ${isUpdating ? 'cursor-not-allowed' : ''
                    }`}
            >
                {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Updating...
                    </span>
                ) : (
                    action.label
                )}
            </button>
        );
    }

    // Multiple actions - show dropdown
    return (
        <div className="relative flex-1">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
            >
                {isUpdating ? (
                    <>
                        <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Updating...
                    </>
                ) : (
                    <>
                        Update Status
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </>
                )}
            </button>

            {isOpen && !isUpdating && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        {validNextStatuses.map((status) => (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() => handleStatusChange(status.value)}
                                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-gray-50"
                            >
                                <span className={status.color}>{status.label}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderStatusSelector;
