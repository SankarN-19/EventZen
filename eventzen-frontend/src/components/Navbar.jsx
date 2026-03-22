import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../api/authApi';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try { await logoutUser(); } catch { }
        logout();
        toast.success('Logged out successfully');
        navigate('/');
    };

    const roleColors = {
        ADMIN: 'bg-blue-100 text-blue-700',
        CLIENT: 'bg-purple-100 text-purple-700',
        ATTENDEE: 'bg-green-100 text-green-700'
    };

    const homePath =
        user?.role === 'ADMIN' ? '/dashboard' :
            user?.role === 'CLIENT' ? '/client-dashboard' :
                '/attendee-dashboard';

    return (
        <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">

            {/* Logo */}
            <Link to={homePath} className="text-xl font-bold text-blue-600 tracking-tight">
                EventZen
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
                {isAdmin() ? (
                    <>
                        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
                        <Link to="/venues" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Venues</Link>
                        <Link to="/vendors" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Vendors</Link>
                        <Link to="/events" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Events</Link>
                        <Link to="/bookings" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Bookings</Link>
                        <Link to="/attendees" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Attendees</Link>
                        <Link to="/event-requests" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Requests</Link>
                        <Link to="/budget" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Budget</Link>
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
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 hover:bg-gray-100 rounded-xl px-3 py-2 transition">

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {(user?.name || user?.email || 'U')[0].toUpperCase()}
                    </div>

                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-semibold text-gray-800 leading-tight">
                            {user?.name || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-400 leading-tight">{user?.email}</p>
                    </div>

                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${roleColors[user?.role]}`}>
                        {user?.role}
                    </span>

                    {/* Chevron */}
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50">

                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.name || user?.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <Link to="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                                <span className="text-base">👤</span>
                                My Profile
                            </Link>

                            {user?.role === 'ATTENDEE' && (
                                <Link to="/my-bookings"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                                    <span className="text-base">🎟️</span>
                                    My Bookings
                                </Link>
                            )}

                            {user?.role === 'CLIENT' && (
                                <Link to="/my-requests"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                                    <span className="text-base">📋</span>
                                    My Requests
                                </Link>
                            )}
                        </div>

                        <div className="border-t border-gray-100 py-1">
                            <button onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                                <span className="text-base">🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;