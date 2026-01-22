import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import PickupInfo from '../components/checkout/PickupInfo'
import PaymentInfo from '../components/checkout/PaymentInfo'
import OrderSummary from '../components/checkout/OrderSummary'
import api from '../utils/api'

function Checkout() {
    const navigate = useNavigate()
    const { items, total, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pickupTime, setPickupTime] = useState('')
    const [termsAccepted, setTermsAccepted] = useState(false)

    // Redirect to cart if empty
    useEffect(() => {
        if (!items.length) {
            navigate('/cart')
        }
    }, [items, navigate])

    const handlePlaceOrder = async () => {
        if (!termsAccepted) {
            setError('Please accept the terms and conditions')
            return
        }

        if (!pickupTime) {
            setError('Please select a pickup time')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Prepare order data
            const orderData = {
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price
                })),
                pickup_time: pickupTime,
                payment_method: 'cash',
                total_amount: total
            }

            // Create order
            const response = await api.post('/orders/checkout', orderData)

            // Clear cart and redirect to confirmation
            clearCart()
            navigate(`/orders/${response.data.order.id}/confirmation`)
        } catch (err) {
            console.error('Order error:', err)
            setError(err.response?.data?.message || 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!items.length) {
        return null
    }

    return (
        <div className="space-y-8 pb-16">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Checkout</h1>
                <p className="text-sm text-gray-600">
                    Complete your order details for pickup
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                {/* Main content */}
                <div className="space-y-6">
                    <PickupInfo
                        pickupTime={pickupTime}
                        setPickupTime={setPickupTime}
                    />
                    <PaymentInfo />
                </div>

                {/* Sidebar */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <OrderSummary
                        items={items}
                        total={total}
                        termsAccepted={termsAccepted}
                        setTermsAccepted={setTermsAccepted}
                        onPlaceOrder={handlePlaceOrder}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    )
}

export default Checkout
