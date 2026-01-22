import { useState } from 'react';
import PropTypes from 'prop-types';

const OrderActions = ({ order, onCancel }) => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const canCancel = order.status === 'Pending';

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        setCancelling(true);
        try {
            await onCancel();
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error cancelling order:', error);
        } finally {
            setCancelling(false);
        }
    };

    return (
        <>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Actions</h2>

                <div className="space-y-3">
                    {/* Cancel Order Button */}
                    {canCancel ? (
                        <button
                            onClick={handleCancelClick}
                            className="w-full rounded-lg border-2 border-red-500 bg-white px-4 py-2 font-medium text-red-500 transition hover:bg-red-50"
                        >
                            Cancel Order
                        </button>
                    ) : (
                        <div className="rounded-lg bg-gray-50 p-4 text-center">
                            <p className="text-sm text-gray-600">
                                {order.status === 'Cancelled'
                                    ? 'This order has been cancelled'
                                    : order.status === 'Completed'
                                        ? 'This order has been completed'
                                        : 'This order can no longer be cancelled'}
                            </p>
                        </div>
                    )}

                    {/* Contact Support */}
                    <button
                        className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Contact Support
                    </button>

                    {/* Help Information */}
                    <div className="mt-4 rounded-lg bg-blue-50 p-4">
                        <div className="flex">
                            <svg className="h-5 w-5 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-blue-900">Need Help?</h3>
                                <p className="mt-1 text-sm text-blue-700">
                                    Call us at (555) 123-4567 or email support@tastebox.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="mb-2 text-center text-xl font-semibold text-gray-900">
                            Cancel Order?
                        </h3>
                        <p className="mb-6 text-center text-gray-600">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                disabled={cancelling}
                                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={cancelling}
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

OrderActions.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default OrderActions;
