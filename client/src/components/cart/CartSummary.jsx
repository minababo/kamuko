import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

function CartSummary() {
    const { total, clearCart, items } = useCart()

    return (
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Order summary</h2>
                <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-gray-400 hover:text-rose-500"
                    disabled={!items.length}
                >
                    Clear cart
                </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Delivery</span>
                    <span className="text-gray-400">Calculated at checkout</span>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4 text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <button
                type="button"
                className="w-full rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
                Proceed to Checkout
            </button>
            <Link
                to="/menu"
                className="block text-center text-sm font-semibold text-orange-600 hover:text-orange-500"
            >
                Continue shopping
            </Link>
        </section>
    )
}

export default CartSummary
