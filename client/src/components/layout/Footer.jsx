import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Kamuko Restaurant</h3>
                    <p className="text-sm text-gray-600">123 Ocean Drive, Colombo 03</p>
                    <p className="text-sm text-gray-600">+94 11 234 5678</p>
                    <p className="text-sm text-gray-600">hello@kamuko.lk</p>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
                        Quick links
                    </h4>
                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                        <Link to="/menu" className="hover:text-orange-600">
                            Menu
                        </Link>
                        <Link to="/about" className="hover:text-orange-600">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-orange-600">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-500">
                © 2026 Kamuko. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
