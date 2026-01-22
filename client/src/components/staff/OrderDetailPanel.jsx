import { useEffect, useRef } from 'react';
import OrderStatusSelector from './OrderStatusSelector';

function OrderDetailPanel({ order, onClose, onStatusChange }) {
    const panelRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
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

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white shadow-2xl sm:w-[500px]"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Order #{order.id?.slice(-8) || order.orderNumber}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Placed {formatTime(order.createdAt)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6">
                    {/* Status */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Order Status
                        </label>
                        <div className="flex items-center gap-3">
                            <span
                                className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${getStatusColor(order.status)}`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Customer Information
                        </h3>
                        <div className="space-y-2">
                            {order.customer?.name && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4 text-gray-500"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-gray-900">{order.customer.name}</span>
                                </div>
                            )}
                            {order.customer?.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4 text-gray-500"
                                    >
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                    </svg>
                                    <span className="text-gray-600">{order.customer.email}</span>
                                </div>
                            )}
                            {order.customer?.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4 text-gray-500"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-gray-600">{order.customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">Order Items</h3>
                        <div className="space-y-3">
                            {order.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 bg-white p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                                {item.quantity}x {item.name || item.productName}
                                            </div>
                                            {item.specialInstructions && (
                                                <div className="mt-2 rounded-md bg-orange-50 p-2">
                                                    <div className="text-xs font-medium text-orange-800">
                                                        Special Instructions:
                                                    </div>
                                                    <div className="mt-1 text-sm text-orange-700">
                                                        {item.specialInstructions}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {item.price && (
                                            <div className="ml-4 font-medium text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <h3 className="mb-2 text-sm font-semibold text-orange-900">
                                Order Notes
                            </h3>
                            <p className="text-sm text-orange-700">{order.notes}</p>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                            Order Summary
                        </h3>
                        <div className="space-y-2">
                            {order.subtotal && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">
                                        ${order.subtotal.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {order.tax && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">${order.tax.toFixed(2)}</span>
                                </div>
                            )}
                            {order.deliveryFee && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="text-gray-900">
                                        ${order.deliveryFee.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            {order.totalAmount && (
                                <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        ${order.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    {order.paymentMethod && (
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                            <h3 className="mb-2 text-sm font-semibold text-gray-900">
                                Payment Information
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-4 w-4 text-gray-500"
                                >
                                    <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                                    <path
                                        fillRule="evenodd"
                                        d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="capitalize text-gray-900">
                                    {order.paymentMethod}
                                </span>
                                {order.paymentStatus && (
                                    <span className="ml-auto rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                        {order.paymentStatus}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6">
                    <div className="flex gap-3">
                        <OrderStatusSelector
                            currentStatus={order.status}
                            orderId={order.id}
                            onStatusChange={onStatusChange}
                        />
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetailPanel;
