import { Link } from 'react-router-dom'

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
                🛒
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">Your cart is empty</h1>
                <p className="text-sm text-gray-600">
                    Add something delicious from the menu to get started.
                </p>
            </div>
            <Link
                to="/menu"
                className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
                Browse menu
            </Link>
        </div>
    )
}

export default EmptyCart
