import MenuItemCard from './MenuItemCard'

function MenuGrid({ items, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={`menu-skeleton-${index}`}
                        className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                    >
                        <div className="h-48 animate-pulse bg-gray-100" />
                        <div className="space-y-4 p-5">
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                            <div className="h-3 w-5/6 animate-pulse rounded bg-gray-100" />
                            <div className="mt-4 flex items-center justify-between">
                                <div className="h-8 w-28 animate-pulse rounded-full bg-gray-100" />
                                <div className="h-10 w-32 animate-pulse rounded-full bg-gray-100" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
            ))}
        </div>
    )
}

export default MenuGrid
