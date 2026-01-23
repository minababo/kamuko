import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function MobileMenu({
    isOpen,
    onClose,
    navLinks,
    isAuthenticated,
    user,
    itemCount,
    onLogout,
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Menu</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-gray-200 p-2 text-gray-600 hover:text-orange-600"
                        aria-label="Close menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                fillRule="evenodd"
                                d="M6.72 6.72a.75.75 0 011.06 0L12 10.94l4.22-4.22a.75.75 0 111.06 1.06L13.06 12l4.22 4.22a.75.75 0 11-1.06 1.06L12 13.06l-4.22 4.22a.75.75 0 11-1.06-1.06L10.94 12 6.72 7.78a.75.75 0 010-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {navLinks
                        .filter((link) => link.show)
                        .map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={onClose}
                                className="block text-sm font-medium text-gray-700 hover:text-orange-600"
                            >
                                {link.label}
                            </Link>
                        ))}

                    <Link
                        to="/cart"
                        onClick={onClose}
                        className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-orange-600"
                    >
                        <span>Cart</span>
                        {itemCount > 0 && (
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                    {isAuthenticated ? (
                        <div className="space-y-3">
                            <div className="text-sm text-gray-500">Signed in as</div>
                            <div className="text-sm font-semibold text-gray-900">
                                {user?.name || user?.email}
                            </div>
                            <div className="space-y-3 pt-2">
                                <Link
                                    to="/profile"
                                    onClick={onClose}
                                    className="block text-sm font-medium text-gray-700 hover:text-orange-600"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    onClick={onClose}
                                    className="block text-sm font-medium text-gray-700 hover:text-orange-600"
                                >
                                    Orders
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onLogout();
                                        onClose();
                                    }}
                                    className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="block rounded-md border border-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-700"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={onClose}
                                className="block rounded-md bg-orange-600 px-4 py-2 text-center text-sm font-semibold text-white"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;
