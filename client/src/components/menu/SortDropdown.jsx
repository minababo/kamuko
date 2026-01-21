function SortDropdown({ value, onChange }) {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-semibold text-gray-600">
                Sort by
            </label>
            <select
                id="sort"
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="name-asc">Name A-Z</option>
            </select>
        </div>
    )
}

export default SortDropdown
