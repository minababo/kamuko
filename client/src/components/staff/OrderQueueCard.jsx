import { useState } from 'react';
import OrderStatusSelector from './OrderStatusSelector';

function OrderQueueCard({ order, onStatusChange, onViewDetails }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            accepted: 'bg-blue-100 text-blue-700 border-blue-300',
            preparing: 'bg-blue-100 text-blue-700 border-blue-300',
            ready: 'bg-green-100 text-green-700 border-green-300',
            completed: 'bg-gray-100 text-gray-700 border-gray-300',
            cancelled: 'bg-red-100 text-red-700 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const getUrgencyColor = (minutes) => {
        if (minutes > 30) return 'text-red-600';
        if (minutes > 15) return 'text-orange-600';
        return 'text-gray-600';
    };

    const timeSincePlaced = Math.floor(
        (new Date() - new Date(order.createdAt)) / 1000 / 60
    );

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Card Header */}
            <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                                    clipRule="evenodd"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">
                                Order #{order.id?.slice(-8) || order.orderNumber}
                            </div>
                            <div className={`text-sm font-medium ${getUrgencyColor(timeSincePlaced)}`}>
                                {formatTime(order.createdAt)}
                            </div>
                        </div>
                    </div>
                    <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
                {/* Quick Info */}
                <div className="mb-3 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>{order.items?.length || 0} items</span>
                    </div>
                    {order.totalAmount && (
                        <div className="flex items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4"
                            >
                                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                                <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    )}
                </div>

                {/* Items Preview */}
                <div className="mb-4 space-y-2">
                    {(isExpanded ? order.items : order.items?.slice(0, 2))?.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-start justify-between rounded-md bg-gray-50 p-2 text-sm"
                        >
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {item.quantity}x {item.name || item.productName}
                                </div>
                                {item.specialInstructions && (
                                    <div className="mt-1 text-xs text-gray-600">
                                        Note: {item.specialInstructions}
                                    </div>
                                )}
                            </div>
                            {item.price && (
                                <div className="text-gray-600">${item.price.toFixed(2)}</div>
                            )}
                        </div>
                    ))}

                    {order.items?.length > 2 && !isExpanded && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(true)}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700"
                        >
                            + {order.items.length - 2} more items
                        </button>
                    )}
                </div>

                {/* Order Notes */}
                {order.notes && (
                    <div className="mb-4 rounded-md border border-orange-200 bg-orange-50 p-3">
                        <div className="mb-1 text-xs font-medium text-orange-800">Order Notes</div>
                        <div className="text-sm text-orange-700">{order.notes}</div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <OrderStatusSelector
                        currentStatus={order.status}
                        orderId={order.id}
                        onStatusChange={onStatusChange}
                    />
                    <button
                        type="button"
                        onClick={onViewDetails}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        View Details
                    </button>
                </div>

                {/* Expand Toggle */}
                {order.items?.length > 2 && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        >
                            <path
                                fillRule="evenodd"
                                d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default OrderQueueCard;
