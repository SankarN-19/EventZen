import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllVenues } from '../../api/venueApi';
import { getAllEvents } from '../../api/eventApi';
import { getAllBookings } from '../../api/bookingApi';
import { getAllUsers } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        venues: 0, events: 0, bookings: 0, users: 0
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [venuesRes, eventsRes, bookingsRes, usersRes] = await Promise.all([
                    getAllVenues(0, 100),
                    getAllEvents({}),
                    getAllBookings(),
                    getAllUsers(0, 100)
                ]);
                const allVenues = venuesRes.data.data.content || [];
                const activeVenues = allVenues.filter(v => v.isActive).length;
                setStats({
                    venues: activeVenues,
                    events: eventsRes.data.data.totalElements || eventsRes.data.data.content?.length || 0,
                    bookings: bookingsRes.data.data.length || 0,
                    users: usersRes.data.data.totalElements || usersRes.data.data.content?.length || 0,
                });
                setRecentBookings(
                    [...bookingsRes.data.data]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 25)
                );
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const statusColor = (status) => {
        if (status === 'CONFIRMED') return 'bg-green-100 text-green-700';
        if (status === 'CANCELLED') return 'bg-red-100 text-red-700';
        if (status === 'WAITLISTED') return 'bg-yellow-100 text-yellow-700';
        return 'bg-gray-100 text-gray-600';
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard title="Active Venues" value={stats.venues} subtitle="Currently active" color="text-blue-600" />
                <StatCard title="Total Events" value={stats.events} subtitle="All events" color="text-purple-600" />
                <StatCard title="Total Bookings" value={stats.bookings} subtitle="All time bookings" color="text-green-600" />
                <StatCard title="Total Users" value={stats.users} subtitle="Registered users" color="text-orange-500" />
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800">Recent Bookings</h2>
                </div>
                {recentBookings.length === 0 ? (
                    <p className="text-center text-gray-400 py-10 text-sm">No bookings yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Attendee</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Event</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentBookings.map(b => (
                                    <tr key={b._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{b.attendeeName}</td>
                                        <td className="px-6 py-4 text-gray-500">{b.attendeeEmail}</td>
                                        <td className="px-6 py-4 text-gray-500">{b.eventId?.title || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;