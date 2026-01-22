import PropTypes from 'prop-types';
import StatusStep from './StatusStep';

const OrderStatusTracker = ({ status }) => {
    // Define all possible statuses in order
    const statusSteps = [
        { key: 'Pending', label: 'Order Placed', icon: '📝' },
        { key: 'Accepted', label: 'Order Accepted', icon: '✓' },
        { key: 'Preparing', label: 'Preparing', icon: '👨‍🍳' },
        { key: 'Ready', label: 'Ready for Pickup', icon: '📦' },
        { key: 'Completed', label: 'Completed', icon: '✅' },
    ];

    // Handle cancelled status separately
    if (status === 'Cancelled') {
        return (
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Cancelled</h3>
                <p className="mt-1 text-sm text-gray-600">This order has been cancelled</p>
            </div>
        );
    }

    // Find current status index
    const currentIndex = statusSteps.findIndex(step => step.key === status);

    // Determine status for each step
    const getStepStatus = (index) => {
        if (index < currentIndex) return 'completed';
        if (index === currentIndex) return 'current';
        return 'upcoming';
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Track Your Order</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Current status: <span className="font-medium text-orange-600">{status}</span>
                </p>
            </div>

            {/* Vertical Stepper */}
            <div className="relative">
                {statusSteps.map((step, index) => (
                    <StatusStep
                        key={step.key}
                        label={step.label}
                        status={getStepStatus(index)}
                        icon={step.icon}
                        isLast={index === statusSteps.length - 1}
                    />
                ))}
            </div>

            {/* Estimated time (optional) */}
            {status !== 'Completed' && status !== 'Cancelled' && (
                <div className="mt-6 rounded-lg bg-orange-50 p-4">
                    <div className="flex items-start">
                        <svg className="mr-3 h-5 w-5 shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-orange-900">Estimated Preparation Time</p>
                            <p className="mt-1 text-sm text-orange-700">
                                Your order will be ready in approximately 15-25 minutes
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

OrderStatusTracker.propTypes = {
    status: PropTypes.oneOf(['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled']).isRequired,
};

export default OrderStatusTracker;
