import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import MobileMenu from './MobileMenu';

const linkBaseClass = 'text-sm font-medium transition-colors';
const linkClass = ({ isActive }) =>
    `${linkBaseClass} ${isActive ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'}`;

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const navLinks = [
        { to: '/', label: 'Home', show: true },
        { to: '/menu', label: 'Menu', show: true },
        { to: '/orders', label: 'Orders', show: isAuthenticated },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/login', { replace: true });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileOpen(true)}
                        className="rounded-md border border-gray-200 p-2 text-gray-600 hover:text-orange-600 md:hidden"
                        aria-label="Open menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 17.25z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    <Link to="/" className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                            T
                        </span>
                        <span className="text-lg font-semibold text-gray-900">TasteBox</span>
                    </Link>
                </div>

                <div className="hidden items-center gap-6 md:flex">
                    {navLinks
                        .filter((link) => link.show)
                        .map((link) => (
                            <NavLink key={link.to} to={link.to} className={linkClass}>
                                {link.label}
                            </NavLink>
                        ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/cart"
                        className="relative rounded-full border border-gray-200 p-2 text-gray-600 hover:text-orange-600"
                        aria-label="View cart"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path d="M2.25 3.75a.75.75 0 00-.75.75v.5c0 .414.336.75.75.75h1.5l2.055 9.493A2.25 2.25 0 008.007 17.25h8.486a2.25 2.25 0 002.202-1.757l1.486-6.687A.75.75 0 0019.45 7.5H6.33l-.42-1.94A.75.75 0 005.175 5.25H2.25z" />
                            <path d="M7.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        {itemCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
                                {itemCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:text-orange-600"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                                <span className="hidden sm:inline">{user?.name || 'Account'}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M12.53 16.28a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 011.06-1.06L12 14.69l3.97-3.97a.75.75 0 111.06 1.06l-4.5 4.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-100 bg-white py-2 text-sm shadow-lg">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50"
                                    >
                                        Orders
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-orange-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                to="/login"
                                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:text-orange-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <MobileMenu
                isOpen={isMobileOpen}
                onClose={() => setIsMobileOpen(false)}
                navLinks={navLinks}
                isAuthenticated={isAuthenticated}
                user={user}
                itemCount={itemCount}
                onLogout={handleLogout}
            />
        </header>
    );
}

export default Navbar;
