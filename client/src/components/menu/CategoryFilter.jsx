import { useEffect, useState } from 'react'
import api from '../../utils/api'

function CategoryFilter({ activeCategory = 'all', onChange }) {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let isActive = true

        const loadCategories = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await api.get('/categories')
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.categories || []
                if (isActive) setCategories(data)
            } catch {
                if (isActive) setError('Unable to load categories right now.')
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        loadCategories()
        return () => {
            isActive = false
        }
    }, [])

    if (isLoading) {
        return (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={`category-skeleton-${index}`}
                        className="h-9 w-24 animate-pulse rounded-full bg-gray-100"
                    />
                ))}
            </div>
        )
    }

    if (error) {
        return <p className="mt-3 text-sm text-orange-600">{error}</p>
    }

    return (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            <button
                type="button"
                onClick={() => onChange?.('all')}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === 'all'
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                    }`}
            >
                All
            </button>
            {categories.map((category) => {
                const id = category._id || category.id
                const isActive = activeCategory === id
                return (
                    <button
                        key={id}
                        type="button"
                        onClick={() => onChange?.(id)}
                        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:text-orange-600'
                            }`}
                    >
                        {category.name}
                    </button>
                )
            })}
        </div>
    )
}

export default CategoryFilter
