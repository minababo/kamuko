import MenuItemCard from '../menu/MenuItemCard'

function RelatedItems({ items, categoryName }) {
    if (!items?.length) return null

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                        More to try
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Related items{categoryName ? ` in ${categoryName}` : ''}
                    </h2>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {items.map((item) => (
                    <div key={item.id} className="min-w-[240px] flex-1 sm:min-w-[260px]">
                        <MenuItemCard item={item} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default RelatedItems
