import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from './Loader';

function ProtectedRoute({ roles = [], redirectTo = '/login', children }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Loader fullPage />;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children || <Outlet />;
}

export default ProtectedRoute;
