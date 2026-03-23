import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getAllEvents } from '../../api/eventApi';
import { getMyBookings } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    WAITLISTED: 'bg-yellow-100 text-yellow-700'
};

const CATEGORY_ICONS = {
    CONFERENCE: '🎤', WEDDING: '💒',
    CONCERT: '🎵', CORPORATE: '🏢', OTHER: '🎉'
};

const AttendeeDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAllEvents({ status: 'UPCOMING' }),
            getMyBookings(user.id)
        ]).then(([evRes, bkRes]) => {
            setEvents(evRes.data.data.content || []);
            setBookings(bkRes.data.data || []);
        }).finally(() => setLoading(false));
    }, []);

    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const waitlisted = bookings.filter(b => b.status === 'WAITLISTED').length;

    return (
        <Layout>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl px-8 py-8 mb-8 flex items-center justify-between">
                <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Welcome back 👋</p>
                    <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                    <p className="text-green-100 text-sm mt-1">Discover and book your next event</p>
                </div>
                <Link to="/browse"
                    className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl text-sm font-bold transition shadow-md">
                    Browse Events
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Bookings', value: bookings.length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Confirmed', value: confirmed, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { label: 'On Waitlist', value: waitlisted, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}>
                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                        <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <Link to="/browse"
                    className="group bg-white border border-gray-200 hover:border-green-300 hover:shadow-md rounded-2xl p-6 transition flex gap-5 items-start">
                    <div className="bg-green-100 group-hover:bg-green-600 rounded-xl p-4 transition">
                        <span className="text-2xl">🎟️</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1">Browse Events</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Explore all upcoming events — conferences, weddings, concerts and more. Book your seat instantly.
                        </p>
                        <span className="inline-block mt-3 text-green-600 text-xs font-semibold group-hover:underline">
                            Explore events →
                        </span>
                    </div>
                </Link>

                <Link to="/my-bookings"
                    className="group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 transition flex gap-5 items-start">
                    <div className="bg-blue-100 group-hover:bg-blue-600 rounded-xl p-4 transition">
                        <span className="text-2xl">📁</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1">My Bookings</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            View all your confirmed and waitlisted bookings. Cancel anytime directly from your booking history.
                        </p>
                        <span className="inline-block mt-3 text-blue-600 text-xs font-semibold group-hover:underline">
                            View bookings →
                        </span>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800">My Recent Bookings</h2>
                        <Link to="/my-bookings" className="text-blue-600 text-xs font-semibold hover:underline">View all</Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-3xl mb-2">🎟️</p>
                            <p className="text-gray-400 text-sm">No bookings yet</p>
                            <Link to="/browse"
                                className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition">
                                Book an event
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {bookings.slice(0, 4).map(b => (
                                <div key={b._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-sm">
                                            {CATEGORY_ICONS[b.eventId?.category] || '🎉'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {b.eventId?.title || 'Event'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {b.eventId?.date
                                                    ? new Date(b.eventId.date).toLocaleDateString('en-IN')
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status]}`}>
                                        {b.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-800">Upcoming Events</h2>
                        <Link to="/browse" className="text-blue-600 text-xs font-semibold hover:underline">Browse all</Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-sm">No upcoming events</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {events.slice(0, 4).map(ev => (
                                <div key={ev._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-sm">
                                            {CATEGORY_ICONS[ev.category] || '🎉'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{ev.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(ev.date).toLocaleDateString('en-IN')} · {ev.venueName || 'Venue TBD'} · {ev.capacity} seats
                                            </p>
                                        </div>
                                    </div>
                                    <Link to="/browse"
                                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold transition shrink-0">
                                        Book
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AttendeeDashboard;