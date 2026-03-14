import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getMyBookings, cancelBooking } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    WAITLISTED: 'bg-yellow-100 text-yellow-700'
};

const MyBookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await getMyBookings(user.id);
            setBookings(res.data.data || []);
        } catch { toast.error('Failed to load bookings'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return;
        try {
            await cancelBooking(id);
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel');
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-500 text-sm mt-1">View and manage your event bookings</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">You have no bookings yet</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {bookings.map(b => (
                        <div key={b._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[b.status]}`}>
                                    {b.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900">{b.eventId?.title || 'Event'}</h3>
                            <p className="text-sm text-gray-500 mt-1">{b.attendeeName}</p>
                            <p className="text-sm text-gray-400">{b.attendeeEmail}</p>
                            {b.status !== 'CANCELLED' && (
                                <button onClick={() => handleCancel(b._id)}
                                    className="mt-4 w-full border border-red-300 text-red-500 hover:bg-red-50 py-1.5 rounded-lg text-sm font-medium transition">
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default MyBookingsPage;