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
    const [settings, setSettings] = useState(null)
    const [settingsLoading, setSettingsLoading] = useState(false)
    const [settingsError, setSettingsError] = useState(null)

    // Redirect to cart if empty
    useEffect(() => {
        if (!items.length) {
            navigate('/cart')
        }
    }, [items, navigate])

    useEffect(() => {
        let active = true

        const fetchSettings = async () => {
            try {
                setSettingsLoading(true)
                const response = await api.get('/settings/store')
                if (active) {
                    setSettings(response.data)
                    setSettingsError(null)
                }
            } catch (err) {
                if (active) {
                    setSettingsError(
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        'Failed to load store settings'
                    )
                }
            } finally {
                if (active) setSettingsLoading(false)
            }
        }

        fetchSettings()

        return () => {
            active = false
        }
    }, [])

    const handlePlaceOrder = async () => {
        if (!termsAccepted) {
            setError('Please accept the terms and conditions')
            return
        }

        if (!pickupTime) {
            setError('Please select a pickup time')
            return
        }

        if (settings && !settings.orderingOpen) {
            setError(settings.closedMessage || 'Ordering is currently closed')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Sync local cart to server cart used by checkout
            await api.delete('/cart')
            await Promise.all(
                items.map((item) =>
                    api.post('/cart/items', {
                        productId: item.id || item._id,
                        quantity: item.quantity,
                        note: item.notes || item.note || '',
                    })
                )
            )

            // Create order
            const response = await api.post('/orders/checkout', {
                customerNote: '',
            })

            // Clear cart and redirect to confirmation
            clearCart()
            navigate(`/orders/${response.data.orderId}/confirmation`)
        } catch (err) {
            console.error('Order error:', err)
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to place order. Please try again.'
            )
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
            {!settingsLoading && settings?.orderingOpen === false && (
                <div className="rounded-lg bg-orange-50 p-4">
                    <p className="text-sm font-medium text-orange-800">
                        {settings.closedMessage || 'Ordering is currently closed'}
                    </p>
                </div>
            )}
            {settingsError && (
                <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{settingsError}</p>
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
                        orderingOpen={settings?.orderingOpen !== false}
                    />
                </div>
            </div>
        </div>
    )
}

export default Checkout
