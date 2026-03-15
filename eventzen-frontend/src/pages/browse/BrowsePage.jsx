import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllEvents } from '../../api/eventApi';
import { createBooking } from '../../api/bookingApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BrowsePage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingEvent, setBookingEvent] = useState(null);
    const [form, setForm] = useState({ attendeeName: '', attendeeEmail: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getAllEvents({ status: 'UPCOMING' })
            .then(res => setEvents(res.data.data.content || []))
            .catch(() => toast.error('Failed to load events'))
            .finally(() => setLoading(false));
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createBooking({
                eventId: bookingEvent._id,
                userId: user.id,
                attendeeName: form.attendeeName,
                attendeeEmail: form.attendeeEmail
            });
            toast.success('Booking confirmed!');
            setBookingEvent(null);
            setForm({ attendeeName: '', attendeeEmail: '' });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Booking failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Browse Events</h1>
                <p className="text-gray-500 text-sm mt-1">Find and book upcoming events</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No upcoming events available</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map(ev => (
                        <div key={ev._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                                        {ev.category}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(ev.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-base mt-2">{ev.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{ev.description || 'No description'}</p>
                                <p className="text-xs text-gray-400 mt-2">Venue: {ev.venueName || ev.venueId}</p>
                                <p className="text-xs text-gray-400">Capacity: {ev.capacity}</p>
                            </div>
                            <button onClick={() => setBookingEvent(ev)}
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {bookingEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">Book Event</h2>
                        <p className="text-sm text-gray-500 mb-4">{bookingEvent.title}</p>
                        <form onSubmit={handleBook} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Your Name</label>
                                <input type="text" required value={form.attendeeName}
                                    onChange={e => setForm({ ...form, attendeeName: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Your Email</label>
                                <input type="email" required value={form.attendeeEmail}
                                    onChange={e => setForm({ ...form, attendeeEmail: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                                    {saving ? 'Booking...' : 'Confirm Booking'}
                                </button>
                                <button type="button" onClick={() => setBookingEvent(null)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold">
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

export default BrowsePage;