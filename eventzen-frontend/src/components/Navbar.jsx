import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/authApi';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await logoutUser(); } catch { }
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
            <Link to={isAdmin() ? '/dashboard' : '/browse'}
                className="text-xl font-bold text-blue-600 tracking-tight">
                EventZen
            </Link>

            <div className="flex items-center gap-6">
                {isAdmin() ? (
                    <>
                        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                        <Link to="/venues" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Venues</Link>
                        <Link to="/events" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Events</Link>
                        <Link to="/bookings" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Bookings</Link>
                        <Link to="/budget" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Budget</Link>
                        <Link to="/vendors" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Vendors</Link>
                        <Link to="/attendees" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Attendees</Link>
                        <Link to="/event-requests" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Requests</Link>
                    </>
                ) : user?.role === 'CLIENT' ? (
                    <>
                        <Link to="/client-dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/request-event" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Request Event</Link>
                        <Link to="/my-requests" className="text-sm text-gray-600 hover:text-blue-600 font-medium">My Requests</Link>
                    </>
                ) : (
                    <>
                        <Link to="/attendee-dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/browse" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Browse Events</Link>
                        <Link to="/my-bookings" className="text-sm text-gray-600 hover:text-blue-600 font-medium">My Bookings</Link>
                    </>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-500">{user?.email}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold
                        ${user?.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                            user?.role === 'CLIENT' ? 'bg-purple-100 text-purple-700' :
                                'bg-green-100 text-green-700'}`}>
                        {user?.role}
                    </span>
                    <button onClick={handleLogout}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;