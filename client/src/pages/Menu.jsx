import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import CategoryFilter from '../components/menu/CategoryFilter'
import SearchBar from '../components/menu/SearchBar'
import SortDropdown from '../components/menu/SortDropdown'
import MenuGrid from '../components/menu/MenuGrid'

const SORT_OPTIONS = {
    PRICE_ASC: 'price-asc',
    PRICE_DESC: 'price-desc',
    NAME_ASC: 'name-asc',
}

const normalizeItem = (item) => ({
    id: item._id || item.id,
    name: item.name,
    description: item.description || item.details || '',
    price: Number(item.price) || 0,
    imageUrl: item.imageUrl || item.image || item.photo,
    categoryId: item.category?._id || item.category || item.categoryId,
    categoryActive: item.category?.isActive,
})

function Menu() {
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryParam = searchParams.get('category') || 'all'
    const queryParam = searchParams.get('q') || ''

    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sort, setSort] = useState(SORT_OPTIONS.PRICE_ASC)
    const [searchValue, setSearchValue] = useState(queryParam)

    useEffect(() => {
        setSearchValue(queryParam)
    }, [queryParam])

    useEffect(() => {
        let isActive = true

        const loadItems = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await api.get('/products', {
                    params:
                        categoryParam && categoryParam !== 'all'
                            ? { category: categoryParam }
                            : {},
                })
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.items || response.data?.products || []

                if (isActive) {
                    const normalized = data.map(normalizeItem);
                    setItems(
                        normalized.filter((item) => item.categoryActive !== false)
                    )
                }
            } catch {
                if (isActive) setError('Unable to load menu items right now.')
            } finally {
                if (isActive) setIsLoading(false)
            }
        }

        loadItems()
        return () => {
            isActive = false
        }
    }, [categoryParam])

    const filteredItems = useMemo(() => {
        const query = queryParam.trim().toLowerCase()
        let filtered = items

        if (query) {
            filtered = filtered.filter((item) => {
                const nameMatch = item.name?.toLowerCase().includes(query)
                const descriptionMatch = item.description?.toLowerCase().includes(query)
                return nameMatch || descriptionMatch
            })
        }

        const sorted = [...filtered]
        switch (sort) {
            case SORT_OPTIONS.PRICE_DESC:
                sorted.sort((a, b) => b.price - a.price)
                break
            case SORT_OPTIONS.NAME_ASC:
                sorted.sort((a, b) => a.name.localeCompare(b.name))
                break
            case SORT_OPTIONS.PRICE_ASC:
            default:
                sorted.sort((a, b) => a.price - b.price)
                break
        }

        return sorted
    }, [items, queryParam, sort])

    const handleCategoryChange = (categoryId) => {
        const nextParams = new URLSearchParams(searchParams)
        if (!categoryId || categoryId === 'all') {
            nextParams.delete('category')
        } else {
            nextParams.set('category', categoryId)
        }
        setSearchParams(nextParams, { replace: true })
    }

    const handleSearchChange = (value) => {
        const nextParams = new URLSearchParams(searchParams)
        if (value) {
            nextParams.set('q', value)
        } else {
            nextParams.delete('q')
        }
        setSearchParams(nextParams, { replace: true })
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-16 sm:px-6 lg:px-8">
            <header className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                            Explore
                        </p>
                        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Our menu</h1>
                        <p className="text-sm text-gray-600 sm:text-base">
                            Discover fresh favorites, handcrafted by our chefs every day.
                        </p>
                    </div>
                    <SearchBar
                        value={searchValue}
                        onSearch={handleSearchChange}
                        onClear={() => handleSearchChange('')}
                        placeholder="Search dishes, drinks, or desserts"
                    />
                </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="space-y-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-semibold text-gray-900">Filter by category</h2>
                        <CategoryFilter
                            activeCategory={categoryParam}
                            onChange={handleCategoryChange}
                        />
                    </div>
                </aside>

                <section className="space-y-6">
                    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Menu items</h2>
                            <p className="text-sm text-gray-600">
                                {filteredItems.length} item{filteredItems.length === 1 ? '' : 's'}
                            </p>
                        </div>
                        <SortDropdown value={sort} onChange={setSort} />
                    </div>

                    {error ? (
                        <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-6 text-sm text-orange-700">
                            {error}
                        </div>
                    ) : filteredItems.length === 0 && !isLoading ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
                            No items match your search or filter. Try a different category or keyword.
                        </div>
                    ) : (
                        <MenuGrid items={filteredItems} isLoading={isLoading} />
                    )}
                </section>
            </div>
        </div>
    )
}

export default Menu
