const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            label: 'Pending',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-800',
            borderColor: 'border-yellow-300'
        },
        preparing: {
            label: 'Preparing',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-800',
            borderColor: 'border-blue-300'
        },
        ready: {
            label: 'Ready',
            bgColor: 'bg-green-100',
            textColor: 'text-green-800',
            borderColor: 'border-green-300'
        },
        completed: {
            label: 'Completed',
            bgColor: 'bg-gray-100',
            textColor: 'text-gray-800',
            borderColor: 'border-gray-300'
        }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
        <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
        >
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;
