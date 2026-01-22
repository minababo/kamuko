const OrderFilters = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'All Orders' },
        { id: 'active', label: 'Active' },
        { id: 'completed', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${activeFilter === filter.id
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default OrderFilters;
