import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../api/eventApi';
import { getAllVenues } from '../../api/venueApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';

const emptyForm = {
    title: '', description: '', date: '', venueId: '',
    venueName: '', capacity: '', category: 'CONFERENCE', organizerId: ''
};

const CATEGORIES = ['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER'];
const STATUS_COLORS = {
    UPCOMING: 'bg-blue-100 text-blue-700',
    ONGOING: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-100 text-red-700'
};

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [form, setForm] = useState({ ...emptyForm, organizerId: user?.id || '' });
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchEvents = async () => {
        try {
            const res = await getAllEvents({});
            setEvents(res.data.data.content || []);
        } catch { toast.error('Failed to fetch events'); }
        finally { setLoading(false); }
    };

    const fetchVenues = async () => {
        try {
            const res = await getAllVenues(0, 100);
            setVenues((res.data.data.content || []).filter(v => v.isActive));
        } catch { }
    };

    useEffect(() => { fetchEvents(); fetchVenues(); }, []);

    // When admin picks a venue from dropdown — auto-fill venueId and venueName
    const handleVenueSelect = (venueId) => {
        const selected = venues.find(v => v.id === Number(venueId));
        setForm({
            ...form,
            venueId: venueId,
            venueName: selected ? selected.name : ''
        });
    };

    const openCreate = () => {
        setEditEvent(null);
        setForm({ ...emptyForm, organizerId: user?.id || '' });
        setShowModal(true);
    };

    const openEdit = (ev) => {
        setEditEvent(ev);
        setForm({
            title: ev.title, description: ev.description || '',
            date: ev.date?.split('T')[0] || '',
            venueId: ev.venueId, venueName: ev.venueName || '',
            capacity: ev.capacity, category: ev.category,
            organizerId: ev.organizerId
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                venueId: Number(form.venueId),
                capacity: Number(form.capacity),
                organizerId: Number(form.organizerId)
            };
            if (editEvent) {
                await updateEvent(editEvent._id, payload);
                toast.success('Event updated successfully');
            } else {
                await createEvent(payload);
                toast.success('Event created successfully');
            }
            setShowModal(false);
            fetchEvents();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await deleteEvent(id);
            toast.success('Event deleted');
            fetchEvents();
        } catch { toast.error('Failed to delete event'); }
    };

    const filtered = events.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
            (ev.venueName || '').toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || ev.category === categoryFilter;
        const matchesStatus = statusFilter === 'ALL' || ev.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all events</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search title, venue..." />
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="ALL">All Categories</option>
                        {['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER'].map(c =>
                            <option key={c}>{c}</option>)}
                    </select>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="ALL">All Status</option>
                        {['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].map(s =>
                            <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        + Add Event
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Venue</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Capacity</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No events found</td></tr>
                            ) : filtered.map(ev => (
                                <tr key={ev._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{ev.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                                    <td className="px-6 py-4 text-gray-500">{ev.venueName || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-semibold">
                                            {ev.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{ev.capacity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[ev.status]}`}>
                                            {ev.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openEdit(ev)}
                                            className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                        <button onClick={() => handleDelete(ev._id)}
                                            className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editEvent ? 'Edit Event' : 'Add New Event'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                                <input type="text" required value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                <input type="text" value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                                <input type="date" required value={form.date}
                                    onChange={e => setForm({ ...form, date: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            {/* VENUE DROPDOWN — no more manual ID */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Venue</label>
                                <select required value={form.venueId}
                                    onChange={e => handleVenueSelect(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">— Select a venue —</option>
                                    {venues.map(v => (
                                        <option key={v.id} value={v.id}>
                                            {v.name} — {v.location} (Cap: {v.capacity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Capacity</label>
                                <input type="number" required value={form.capacity}
                                    onChange={e => setForm({ ...form, capacity: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                                <select value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60">
                                    {saving ? 'Saving...' : editEvent ? 'Update' : 'Create'}
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

export default EventsPage;