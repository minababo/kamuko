import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import { useCart } from '../../hooks/useCart'
import Loader from '../common/Loader'

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'

function FeaturedItems() {
    const { addItem } = useCart()
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isActive = true

        const mapItems = (data) =>
            data.map((item) => ({
                id: item._id || item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl || item.image,
            }))

        const loadFeatured = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await api.get('/products/featured')
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.items || response.data?.products || []

                const featured = mapItems(data).slice(0, 6)
                if (!featured.length) {
                    if (isActive) setError('No featured items available right now.')
                    return
                }
                if (isActive) setItems(featured)
            } catch {
                if (isActive) setError('Unable to load featured items right now.')
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        loadFeatured()
        return () => {
            isActive = false
        }
    }, [])

    const gridItems = useMemo(() => items.filter((item) => item.id), [items])

    if (isLoading) {
        return (
            <div className="flex justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8">
                <Loader label="Loading featured items" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-6 text-sm text-orange-700">
                {error}
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((item) => (
                <article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                    <div className="relative h-44 overflow-hidden">
                        <img
                            src={item.imageUrl || FALLBACK_IMAGE}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-600">
                            Chef&apos;s pick
                        </span>
                    </div>
                    <div className="space-y-3 p-5">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                            <span className="text-sm font-semibold text-orange-600">${item.price?.toFixed(2)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                addItem({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    imageUrl: item.imageUrl,
                                })
                            }
                            className="w-full rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                            Add to cart
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default FeaturedItems
