import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllBookings, approveBooking, rejectBooking } from '../../api/bookingApi';
import toast from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';

const STATUS_COLORS = {
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    WAITLISTED: 'bg-yellow-100 text-yellow-700'
};

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchBookings = async () => {
        try {
            const res = await getAllBookings();
            setBookings(res.data.data || []);
        } catch { toast.error('Failed to fetch bookings'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleApprove = async (id) => {
        try {
            await approveBooking(id);
            toast.success('Booking approved');
            fetchBookings();
        } catch { toast.error('Failed to approve'); }
    };

    const handleReject = async (id) => {
        try {
            await rejectBooking(id);
            toast.success('Booking rejected');
            fetchBookings();
        } catch { toast.error('Failed to reject'); }
    };

    const filtered = bookings.filter(b => {
        const matchesSearch = b.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
            b.attendeeEmail.toLowerCase().includes(search.toLowerCase()) ||
            (b.eventId?.title || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).slice().reverse();

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all event bookings</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, event..." />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="ALL">All Status</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="WAITLISTED">Waitlisted</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Attendee</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Event</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No bookings found</td></tr>
                            ) : filtered.map(b => (
                                <tr key={b._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{b.attendeeName}</td>
                                    <td className="px-6 py-4 text-gray-500">{b.attendeeEmail}</td>
                                    <td className="px-6 py-4 text-gray-500">{b.eventId?.title || b.eventId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {b.status !== 'CONFIRMED' && (
                                            <button onClick={() => handleApprove(b._id)}
                                                className="text-green-600 hover:underline text-xs font-medium">Approve</button>
                                        )}
                                        {b.status !== 'CANCELLED' && (
                                            <button onClick={() => handleReject(b._id)}
                                                className="text-red-500 hover:underline text-xs font-medium">Reject</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Layout>
    );
};

export default BookingsPage;