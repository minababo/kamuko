import { Link } from 'react-router-dom';

function PendingOrdersAlert({ count }) {
    if (count === 0) {
        return null;
    }

    return (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6 text-yellow-600"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="font-semibold text-yellow-900">
                            {count} {count === 1 ? 'New Order' : 'New Orders'} Pending
                        </div>
                        <div className="text-sm text-yellow-700">
                            {count === 1
                                ? 'A new order needs your attention'
                                : `${count} orders are waiting to be processed`}
                        </div>
                    </div>
                </div>
                <Link
                    to="/staff/orders?status=pending"
                    className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
                >
                    View Orders
                </Link>
            </div>
        </div>
    );
}

export default PendingOrdersAlert;
