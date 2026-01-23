function ProductInfo({ item, title }) {
    if (!item) return null

    const isAvailable = item.available ?? true

    return (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    {item.categoryName && (
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            {item.categoryName}
                        </span>
                    )}
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isAvailable
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-600'
                        }`}
                    >
                        {isAvailable ? 'Available now' : 'Currently unavailable'}
                    </span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{title}</h1>
                <p className="text-3xl font-semibold text-orange-600">
                    ${Number(item.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 sm:text-base">
                    {item.description || 'Chef-curated favorite with seasonal ingredients.'}
                </p>
            </div>
        </section>
    )
}

export default ProductInfo
