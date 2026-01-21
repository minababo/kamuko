function QuantitySelector({ value, onChange }) {
    const handleChange = (next) => {
        if (next < 1 || next > 10) return
        onChange?.(next)
    }

    return (
        <div className="flex items-center rounded-full border border-gray-200 px-2 py-1">
            <button
                type="button"
                onClick={() => handleChange(value - 1)}
                disabled={value <= 1}
                className="flex h-8 w-8 items-center justify-center text-lg text-gray-500 disabled:cursor-not-allowed disabled:text-gray-300"
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-700">
                {value}
            </span>
            <button
                type="button"
                onClick={() => handleChange(value + 1)}
                disabled={value >= 10}
                className="flex h-8 w-8 items-center justify-center text-lg text-gray-500 disabled:cursor-not-allowed disabled:text-gray-300"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    )
}

export default QuantitySelector
