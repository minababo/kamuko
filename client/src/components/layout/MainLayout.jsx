import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function MainLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-left text-gray-900">
            <Navbar />
            <main className="flex-1">
                <div className="mx-auto w-full max-w-6xl px-4 py-8">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
