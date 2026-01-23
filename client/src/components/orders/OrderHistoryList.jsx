import OrderCard from './OrderCard';
import { Package } from 'lucide-react';

const OrderHistoryList = ({ orders, emptyMessage }) => {
    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <Package size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No orders found
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                    {emptyMessage || "You haven't placed any orders yet. Start exploring our menu!"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:gap-6">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
};

export default OrderHistoryList;
