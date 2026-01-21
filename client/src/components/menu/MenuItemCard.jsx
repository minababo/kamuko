import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'

function MenuItemCard({ item }) {
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)

    const handleCardClick = () => {
        if (item?.id) navigate(`/menu/${item.id}`)
    }

    const handleAdd = (event) => {
        event.stopPropagation()
        addItem(
            {
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
            },
            quantity
        )
    }

    const updateQuantity = (event, delta) => {
        event.stopPropagation()
        setQuantity((prev) => Math.max(1, prev + delta))
    }

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') handleCardClick()
            }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.imageUrl || FALLBACK_IMAGE}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-600">
                    ${item.price?.toFixed(2)}
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <p
                        className="text-sm text-gray-600"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {item.description || 'Seasonal chef-crafted favorite.'}
                    </p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-gray-200 px-2 py-1">
                        <button
                            type="button"
                            onClick={(event) => updateQuantity(event, -1)}
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
                            onClick={(event) => updateQuantity(event, 1)}
                            className="flex h-8 w-8 items-center justify-center text-lg text-gray-500 hover:text-orange-600"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    )
}

export default MenuItemCard
