const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
};

function Loader({ fullPage = false, size = 'md', label = 'Loading...' }) {
    const spinner = (
        <div className="flex items-center gap-3">
            <span
                className={`inline-block animate-spin rounded-full border-orange-500 border-t-transparent ${
                    sizeClasses[size] || sizeClasses.md
                }`}
                aria-hidden="true"
            />
            <span className="text-sm text-gray-600">{label}</span>
        </div>
    );

    if (fullPage) {
        return <div className="flex min-h-screen items-center justify-center">{spinner}</div>;
    }

    return spinner;
}

export default Loader;
