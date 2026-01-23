import CartItem from './CartItem'

function CartItemList({ items }) {
    return (
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Items</h2>
                <span className="text-sm text-gray-500">
                    {items.length} item{items.length === 1 ? '' : 's'}
                </span>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}

export default CartItemList
