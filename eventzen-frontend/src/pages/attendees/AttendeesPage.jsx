import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllBookings } from '../../api/bookingApi';
import { userApi } from './../../api/axiosInstances';
import toast from 'react-hot-toast';
import { getAllEvents } from '../../api/eventApi';

const emptyForm = { userId: '', phone: '', address: '', eventId: '', attendeeName: '' };

const AttendeesPage = () => {
    const [attendees, setAttendees] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const fetchAll = async () => {
        try {
            const [attendeesRes, bookingsRes, eventsRes] = await Promise.all([
                userApi.get('/attendees'),
                getAllBookings(),
                getAllEvents({})
            ]);
            setAttendees(attendeesRes.data.data || []);
            // Only show CONFIRMED bookings in dropdown
            setBookings((bookingsRes.data.data || []).filter(b => b.status === 'CONFIRMED'));
            setEvents(eventsRes.data.data.content || []);
        } catch { toast.error('Failed to fetch data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    // When admin selects a booking — auto fill name and event
    const handleBookingSelect = (bookingId) => {
        const booking = bookings.find(b => b._id === bookingId);
        if (!booking) return;
        setForm({
            ...form,
            userId: booking.userId,
            attendeeName: booking.attendeeName,
            eventId: booking.eventId?._id || booking.eventId || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await userApi.post(`/attendees?userId=${form.userId}`, {
                phone: form.phone,
                address: form.address,
                eventId: form.eventId || null,
                attendeeName: form.attendeeName
            });
            toast.success('Attendee added successfully');
            setShowModal(false);
            setForm(emptyForm);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this attendee record?')) return;
        try {
            await userApi.delete(`/attendees/${id}`);
            toast.success('Attendee removed');
            fetchAll();
        } catch { toast.error('Failed to remove attendee'); }
    };

    const filtered = attendees.filter(a =>
        a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        a.phone?.includes(search)
    );

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
                    <p className="text-gray-500 text-sm mt-1">Track physical event participants</p>
                </div>
                <div className="flex gap-3">
                    <input type="text" placeholder="Search name, email, phone..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                    <button onClick={() => { setForm(emptyForm); setShowModal(true); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        + Add Attendee
                    </button>
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
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Address</th>
                                <th className="px-6 py-3 text-left">Event</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">
                                    {search ? 'No results found' : 'No attendees found'}
                                </td></tr>
                            ) : filtered.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{a.attendeeName || a.user?.name || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.user?.email || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.phone || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{a.address || '—'}</td>
                                    <td className="px-6 py-4">
                                        {a.eventId ? (
                                            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                                {events.find(e => e._id === a.eventId)?.title || `Event #${a.eventId}`}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleDelete(a.id)}
                                            className="text-red-500 hover:underline text-xs font-medium">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Add Attendee Record</h2>
                        <p className="text-xs text-gray-400 mb-4">Select from confirmed bookings — these are people who registered for an event.</p>
                        <form onSubmit={handleSubmit} className="space-y-3">

                            {/* Booking dropdown — shows confirmed bookings */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Select from Confirmed Bookings
                                </label>
                                <select required
                                    onChange={e => handleBookingSelect(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">— Select a booking —</option>
                                    {bookings.map(b => (
                                        <option key={b._id} value={b._id}>
                                            {b.attendeeName} — {b.eventId?.title || 'Event'}
                                        </option>
                                    ))}
                                </select>
                                {form.attendeeName && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        ✓ {form.attendeeName} selected
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                <input type="text" required value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                                <input type="text" required value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60">
                                    {saving ? 'Saving...' : 'Add Attendee'}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AttendeesPage;