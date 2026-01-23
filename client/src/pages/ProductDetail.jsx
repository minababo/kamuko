import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'
import ProductImage from '../components/product/ProductImage'
import ProductInfo from '../components/product/ProductInfo'
import AddToCartSection from '../components/product/AddToCartSection'
import RelatedItems from '../components/product/RelatedItems'

const normalizeItem = (item) => ({
    id: item._id || item.id,
    name: item.name,
    description: item.description || item.details || '',
    price: Number(item.price) || 0,
    imageUrl: item.imageUrl || item.image || item.photo,
    categoryId: item.category?._id || item.category || item.categoryId,
    categoryName: item.category?.name || item.categoryName || item.categoryLabel,
    available:
        item.available ??
        item.isAvailable ??
        item.inStock ??
        (item.status ? item.status === 'available' : true),
})

function ProductDetail() {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isNotFound, setIsNotFound] = useState(false)
    const [error, setError] = useState(null)
    const [relatedItems, setRelatedItems] = useState([])

    useEffect(() => {
        let isActive = true

        const loadItem = async () => {
            setIsLoading(true)
            setError(null)
            setIsNotFound(false)
            try {
                const response = await api.get(`/products/${id}`)
                const data = response.data?.item || response.data?.menuItem || response.data
                if (!data) {
                    if (isActive) setIsNotFound(true)
                    return
                }
                const normalized = normalizeItem(data)
                if (!normalized.id) {
                    if (isActive) setIsNotFound(true)
                    return
                }
                if (isActive) setItem(normalized)
            } catch {
                if (isActive) setError('Unable to load this menu item right now.')
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        loadItem()
        return () => {
            isActive = false
        }
    }, [id])

    useEffect(() => {
        let isActive = true

        const loadRelated = async () => {
            if (!item?.categoryId || !item?.id) return
            try {
                const response = await api.get('/products', {
                    params: { category: item.categoryId },
                })
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.items || response.data?.menuItems || []
                if (isActive) {
                    const normalized = data.map(normalizeItem).filter((menuItem) => menuItem.id !== item.id)
                    setRelatedItems(normalized)
                }
            } catch {
                if (isActive) setRelatedItems([])
            }
        }

        loadRelated()
        return () => {
            isActive = false
        }
    }, [item?.categoryId, item?.id])

    const pageTitle = useMemo(() => item?.name || 'Menu item', [item?.name])

    return (
        <div className="space-y-10 pb-16">
            <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-500"
            >
                <span aria-hidden="true">←</span> Back to menu
            </Link>

            {isLoading ? (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="h-80 animate-pulse rounded-3xl bg-gray-100" />
                    <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
                        <div className="h-6 w-2/3 animate-pulse rounded bg-gray-100" />
                        <div className="h-10 w-1/3 animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                        <div className="h-32 w-full animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-6 text-sm text-orange-700">
                    {error}
                </div>
            ) : isNotFound ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
                    We couldn&apos;t find that menu item. Try browsing the menu instead.
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <ProductImage imageUrl={item?.imageUrl} name={item?.name} />
                    <div className="space-y-6">
                        <ProductInfo item={item} title={pageTitle} />
                        <AddToCartSection item={item} />
                    </div>
                </div>
            )}

            {!isLoading && !error && !isNotFound && (
                <RelatedItems items={relatedItems} categoryName={item?.categoryName} />
            )}
        </div>
    )
}

export default ProductDetail
