import PropTypes from 'prop-types';

const StatusTimeline = ({ statusHistory, status }) => {
    // Create timeline items from status history or generate from current status
    const getTimelineItems = () => {
        if (statusHistory && Array.isArray(statusHistory) && statusHistory.length > 0) {
            return statusHistory.map(item => ({
                status: item.status,
                timestamp: item.timestamp || item.createdAt,
                note: item.note,
            }));
        }

        // If no history, create a single item with current status
        return [
            {
                status: status,
                timestamp: new Date().toISOString(),
                note: null,
            },
        ];
    };

    const timelineItems = getTimelineItems();

    const getStatusColor = (itemStatus) => {
        switch (itemStatus) {
            case 'Completed':
                return 'bg-green-500';
            case 'Cancelled':
                return 'bg-red-500';
            case 'Ready':
                return 'bg-blue-500';
            case 'Preparing':
                return 'bg-yellow-500';
            case 'Accepted':
                return 'bg-purple-500';
            case 'Pending':
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (itemStatus) => {
        switch (itemStatus) {
            case 'Completed':
                return (
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'Cancelled':
                return (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'Ready':
                return (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'Preparing':
                return (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
            case 'Accepted':
                return (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'Pending':
            default:
                return (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    const getStatusDescription = (itemStatus) => {
        switch (itemStatus) {
            case 'Pending':
                return 'Your order has been placed and is waiting for confirmation';
            case 'Accepted':
                return 'Your order has been accepted and will be prepared soon';
            case 'Preparing':
                return 'Our kitchen is preparing your order';
            case 'Ready':
                return 'Your order is ready for pickup';
            case 'Completed':
                return 'Order has been completed';
            case 'Cancelled':
                return 'This order has been cancelled';
            default:
                return '';
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Order Timeline</h2>
                <p className="mt-1 text-sm text-gray-600">Complete history of your order status changes</p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gray-200" />

                {/* Timeline items */}
                <div className="space-y-6">
                    {timelineItems.map((item, index) => (
                        <div key={index} className="relative flex items-start">
                            {/* Icon circle */}
                            <div
                                className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getStatusColor(item.status)}`}
                            >
                                {getStatusIcon(item.status)}
                            </div>

                            {/* Content */}
                            <div className="ml-4 flex-1">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.status}</h3>
                                            <p className="mt-1 text-sm text-gray-600">{getStatusDescription(item.status)}</p>
                                            {item.note && (
                                                <p className="mt-2 text-sm italic text-gray-500">Note: {item.note}</p>
                                            )}
                                        </div>
                                        <span className="ml-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.timestamp).toLocaleString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Status Indicator */}
            <div className="mt-8 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 p-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">Current Status</p>
                        <p className="text-lg font-semibold text-orange-600">{status}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

StatusTimeline.propTypes = {
    statusHistory: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired,
            timestamp: PropTypes.string,
            createdAt: PropTypes.string,
            note: PropTypes.string,
        })
    ),
    status: PropTypes.string.isRequired,
};

StatusTimeline.defaultProps = {
    statusHistory: null,
};

export default StatusTimeline;
