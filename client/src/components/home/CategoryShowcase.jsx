import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import Loader from '../common/Loader'

const CARD_STYLES = [
    'from-orange-100 via-orange-50 to-white',
    'from-amber-100 via-amber-50 to-white',
    'from-rose-100 via-rose-50 to-white',
    'from-emerald-100 via-emerald-50 to-white',
    'from-sky-100 via-sky-50 to-white',
    'from-purple-100 via-purple-50 to-white',
]

const ICONS = ['🥗', '🍜', '🍔', '🍕', '🍣', '🥤']

function CategoryShowcase() {
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
            <div className="flex justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8">
                <Loader label="Loading categories" />
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

    if (!categories.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-600">
                Categories will appear here once they are added.
            </div>
        )
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
                <Link
                    key={category._id || category.id}
                    to={`/menu?category=${category._id || category.id}`}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                    <div
                        className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${CARD_STYLES[index % CARD_STYLES.length]
                            } p-4`}
                    >
                        <span className="text-3xl">{ICONS[index % ICONS.length]}</span>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600">See dishes in this category</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default CategoryShowcase
