import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllVenues, createVenue, updateVenue, deleteVenue, reactivateVenue } from '../../api/venueApi';
import toast from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';

const emptyForm = { name: '', location: '', capacity: '', amenities: '', pricePerDay: '' };

const VenuesPage = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editVenue, setEditVenue] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchVenues = async () => {
        try {
            const res = await getAllVenues(0, 100);
            setVenues(res.data.data.content || []);
        } catch { toast.error('Failed to fetch venues'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVenues(); }, []);

    const openCreate = () => { setEditVenue(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (v) => {
        setEditVenue(v);
        setForm({
            name: v.name, location: v.location, capacity: v.capacity,
            amenities: v.amenities || '', pricePerDay: v.pricePerDay
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, capacity: Number(form.capacity), pricePerDay: Number(form.pricePerDay) };
            if (editVenue) {
                await updateVenue(editVenue.id, payload);
                toast.success('Venue updated successfully');
            } else {
                await createVenue(payload);
                toast.success('Venue created successfully');
            }
            setShowModal(false);
            fetchVenues();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleToggleActive = async (venue) => {
        try {
            if (venue.isActive) {
                await deleteVenue(venue.id);
                toast.success('Venue deactivated');
            } else {
                await reactivateVenue(venue.id);
                toast.success('Venue reactivated');
            }
            fetchVenues();
        } catch { toast.error('Operation failed'); }
    };

    const filtered = venues.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.location.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL'
            ? true
            : statusFilter === 'ACTIVE' ? v.isActive : !v.isActive;
        return matchesSearch && matchesStatus;
    });

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all event venues</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search name, location..." />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <button onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        + Add Venue
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
                                <th className="px-6 py-3 text-left">Location</th>
                                <th className="px-6 py-3 text-left">Capacity</th>
                                <th className="px-6 py-3 text-left">Price/Day</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No venues found</td></tr>
                            ) : filtered.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{v.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{v.location}</td>
                                    <td className="px-6 py-4 text-gray-500">{v.capacity}</td>
                                    <td className="px-6 py-4 text-gray-500">₹{v.pricePerDay?.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {v.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openEdit(v)}
                                            className="text-blue-600 hover:underline text-xs font-medium">
                                            Edit
                                        </button>
                                        <button onClick={() => handleToggleActive(v)}
                                            className={`text-xs font-medium hover:underline
            ${v.isActive ? 'text-red-500' : 'text-green-600'}`}>
                                            {v.isActive ? 'Deactivate' : 'Reactivate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editVenue ? 'Edit Venue' : 'Add New Venue'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {[
                                { label: 'Venue Name', key: 'name', type: 'text' },
                                { label: 'Location', key: 'location', type: 'text' },
                                { label: 'Capacity', key: 'capacity', type: 'number' },
                                { label: 'Amenities', key: 'amenities', type: 'text' },
                                { label: 'Price Per Day (₹)', key: 'pricePerDay', type: 'number' },
                            ].map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                    <input type={type} required={key !== 'amenities'}
                                        value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            ))}
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60">
                                    {saving ? 'Saving...' : editVenue ? 'Update' : 'Create'}
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

export default VenuesPage;