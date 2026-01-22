import PropTypes from 'prop-types';

const OrderPickupInfo = ({ order }) => {
    if (!order) return null;

    // Format pickup time
    const formatPickupTime = (dateString) => {
        if (!dateString) return 'TBD';

        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Estimate pickup time if not provided (e.g., 30 minutes from order time)
    const getPickupTime = () => {
        if (order.pickupTime) {
            return formatPickupTime(order.pickupTime);
        }

        // If no pickup time, estimate based on order creation time
        if (order.createdAt) {
            const orderDate = new Date(order.createdAt);
            const estimatedPickup = new Date(orderDate.getTime() + 30 * 60000); // Add 30 minutes
            return `Estimated: ${formatPickupTime(estimatedPickup)}`;
        }

        return 'Please contact the restaurant';
    };

    // Restaurant address (default if not provided in order)
    const restaurantName = order.restaurantName || 'Our Restaurant';
    const restaurantAddress = order.restaurantAddress || '123 Main Street, City, State 12345';
    const restaurantPhone = order.restaurantPhone || '(555) 123-4567';

    return (
        <div className="space-y-4">
            {/* Heading */}
            <h3 className="text-lg font-semibold text-gray-900">
                Pickup at Counter
            </h3>

            {/* Pickup Time */}
            <div className="rounded-lg bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                    <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-orange-900">Pickup Time</p>
                        <p className="mt-1 text-sm text-orange-800">{getPickupTime()}</p>
                    </div>
                </div>
            </div>

            {/* Restaurant Location */}
            <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Location</h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                        <svg
                            className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <div>
                            <p className="font-medium text-gray-900">{restaurantName}</p>
                            <p className="mt-0.5">{restaurantAddress}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <svg
                            className="h-5 w-5 shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <a
                            href={`tel:${restaurantPhone}`}
                            className="text-orange-600 hover:text-orange-700 hover:underline"
                        >
                            {restaurantPhone}
                        </a>
                    </div>
                </div>
            </div>

            {/* Map Link (optional) */}
            <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                </svg>
                View on Map
            </a>
        </div>
    );
};

OrderPickupInfo.propTypes = {
    order: PropTypes.shape({
        pickupTime: PropTypes.string,
        createdAt: PropTypes.string,
        restaurantName: PropTypes.string,
        restaurantAddress: PropTypes.string,
        restaurantPhone: PropTypes.string,
    }),
};

export default OrderPickupInfo;
