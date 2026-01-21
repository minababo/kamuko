import QuantitySelector from './QuantitySelector'
import { useCart } from '../../hooks/useCart'

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80'

function CartItem({ item }) {
    const { removeItem, updateQuantity } = useCart()

    const handleRemove = () => {
        const confirmed = window.confirm(`Remove ${item.name} from your cart?`)
        if (confirmed) removeItem(item.id)
    }

    return (
        <article className="flex flex-col gap-4 border-b border-dashed border-gray-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                <img
                    src={item.imageUrl || FALLBACK_IMAGE}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    {item.notes && (
                        <p className="mt-1 text-xs text-gray-500">Special: {item.notes}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-orange-600">
                        ${Number(item.price).toFixed(2)} each
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <QuantitySelector
                        value={item.quantity}
                        onChange={(quantity) => updateQuantity(item.id, quantity)}
                    />
                    <div className="text-sm font-semibold text-gray-900">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-sm font-semibold text-rose-500 hover:text-rose-600"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </article>
    )
}

export default CartItem
