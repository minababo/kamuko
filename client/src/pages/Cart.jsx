import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import CartItemList from '../components/cart/CartItemList'
import CartSummary from '../components/cart/CartSummary'
import EmptyCart from '../components/cart/EmptyCart'

function Cart() {
    const { items } = useCart()

    if (!items.length) {
        return <EmptyCart />
    }

    return (
        <div className="space-y-8 pb-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Your cart</h1>
                    <p className="text-sm text-gray-600">
                        Review your order and proceed to checkout when ready.
                    </p>
                </div>
                <Link
                    to="/menu"
                    className="text-sm font-semibold text-orange-600 hover:text-orange-500"
                >
                    Continue shopping
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <CartItemList items={items} />
                <div className="lg:sticky lg:top-24">
                    <CartSummary />
                </div>
            </div>
        </div>
    )
}

export default Cart
