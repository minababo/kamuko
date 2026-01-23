import { ShoppingBag, Loader2 } from 'lucide-react'

function OrderSummary({
    items,
    total,
    termsAccepted,
    setTermsAccepted,
    onPlaceOrder,
    loading,
    orderingOpen = true,
}) {
    return (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>

            {/* Items List */}
            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-4 text-sm">
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Summary Breakdown */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-gray-900">$0.00</span>
                </div>
            </div>

            {/* Total */}
            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-base font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${total.toFixed(2)}</span>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/terms" className="font-medium text-orange-600 hover:text-orange-500">
                            Terms and Conditions
                        </a>
                        {' '}and{' '}
                        <a href="/privacy" className="font-medium text-orange-600 hover:text-orange-500">
                            Privacy Policy
                        </a>
                    </span>
                </label>
            </div>

            {/* Place Order Button */}
            <button
                type="button"
                onClick={onPlaceOrder}
                disabled={loading || !termsAccepted || !orderingOpen}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Placing Order...</span>
                    </>
                ) : (
                    <>
                        <ShoppingBag className="h-5 w-5" />
                        <span>Place Order</span>
                    </>
                )}
            </button>
            {!orderingOpen && (
                <p className="mt-3 text-xs font-medium text-orange-700">
                    Ordering is currently closed.
                </p>
            )}

            {/* Additional Info */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                    By placing this order, you confirm that all details are correct and
                    agree to pay the total amount in cash upon pickup.
                </p>
            </div>
        </section>
    )
}

export default OrderSummary
