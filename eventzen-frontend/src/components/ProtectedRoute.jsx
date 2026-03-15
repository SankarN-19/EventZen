import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
    );

    if (!user) return <Navigate to="/" replace />;
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/browse" replace />;

    return children;
};

export default ProtectedRoute;