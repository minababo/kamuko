import { useState } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../../hooks/useCart'

function AddToCartSection({ item }) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [instructions, setInstructions] = useState('')

    if (!item) return null

    const isAvailable = item.available ?? true

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.min(10, Math.max(1, prev + delta)))
    }

    const handleAddToCart = () => {
        if (!isAvailable) return
        addItem(
            {
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                notes: instructions.trim(),
            },
            quantity
        )
        toast.success(`${item.name} added to cart`)
    }

    return (
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center rounded-full border border-gray-200 px-2 py-1">
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(-1)}
                        className="flex h-8 w-8 items-center justify-center text-lg text-gray-500 hover:text-orange-600"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-700">
                        {quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(1)}
                        className="flex h-8 w-8 items-center justify-center text-lg text-gray-500 hover:text-orange-600"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Max 10</p>
            </div>

            <label className="space-y-2 text-sm font-semibold text-gray-700">
                Special instructions
                <textarea
                    rows={3}
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Any allergies or special requests?"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-normal text-gray-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
            </label>

            <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${isAvailable
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'cursor-not-allowed bg-gray-200 text-gray-500'
                    }`}
            >
                {isAvailable ? 'Add to cart' : 'Unavailable'}
            </button>
        </section>
    )
}

export default AddToCartSection
