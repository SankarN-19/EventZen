import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllVendors, createVendor, updateVendor, deleteVendor } from '../../api/venueApi';
import { getAllVenues } from '../../api/venueApi';
import toast from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';

const emptyForm = { name: '', service: '', email: '', phone: '', venueId: '' };

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editVendor, setEditVendor] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [venueFilter, setVenueFilter] = useState('ALL');

    const fetchAll = async () => {
        try {
            const [vendorsRes, venuesRes] = await Promise.all([
                getAllVendors(),
                getAllVenues(0, 100)
            ]);
            setVendors(vendorsRes.data.data || []);
            setVenues(venuesRes.data.data.content || []);
        } catch { toast.error('Failed to fetch vendors'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const openCreate = () => { setEditVendor(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (v) => {
        setEditVendor(v);
        setForm({
            name: v.name, service: v.service,
            email: v.email || '', phone: v.phone || '',
            venueId: v.venue?.id || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { ...form, venueId: Number(form.venueId) };
            if (editVendor) {
                await updateVendor(editVendor.id, payload);
                toast.success('Vendor updated successfully');
            } else {
                await createVendor(payload);
                toast.success('Vendor created successfully');
            }
            setShowModal(false);
            fetchAll();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        try {
            await deleteVendor(id);
            toast.success('Vendor deleted');
            fetchAll();
        } catch { toast.error('Failed to delete vendor'); }
    };

    const filtered = vendors.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
            v.service.toLowerCase().includes(search.toLowerCase());
        const matchesVenue = venueFilter === 'ALL' || v.venue?.name === venueFilter;
        return matchesSearch && matchesVenue;
    });

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage service providers for each venue</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <SearchBar value={search} onChange={setSearch} placeholder="Search name, service..." />
                    <select value={venueFilter} onChange={e => setVenueFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                        <option value="ALL">All Venues</option>
                        {venues.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                    <button onClick={openCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                        + Add Vendor
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
                                <th className="px-6 py-3 text-left">Service</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Venue</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No vendors found</td></tr>
                            ) : filtered.map(v => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{v.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">
                                            {v.service}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{v.email || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{v.phone || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500">{v.venue?.name || '—'}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => openEdit(v)}
                                            className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                                        <button onClick={() => handleDelete(v.id)}
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
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editVendor ? 'Edit Vendor' : 'Add New Vendor'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {[
                                { label: 'Vendor Name', key: 'name', type: 'text' },
                                { label: 'Service Type', key: 'service', type: 'text', placeholder: 'e.g. Catering, AV, Decor' },
                                { label: 'Email', key: 'email', type: 'email' },
                                { label: 'Phone', key: 'phone', type: 'text' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                    <input type={type}
                                        required={['name', 'service'].includes(key)}
                                        placeholder={placeholder || ''}
                                        value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Assign to Venue</label>
                                <select required value={form.venueId}
                                    onChange={e => setForm({ ...form, venueId: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">— Select a venue —</option>
                                    {venues.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} — {v.location}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition disabled:opacity-60">
                                    {saving ? 'Saving...' : editVendor ? 'Update' : 'Create'}
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

export default VendorsPage;