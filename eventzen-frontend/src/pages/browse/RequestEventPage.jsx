import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { createEventRequest } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['CONFERENCE', 'WEDDING', 'CONCERT', 'CORPORATE', 'OTHER'];
const BUDGETS = ['Under ₹1,00,000', '₹1,00,000 – ₹5,00,000',
    '₹5,00,000 – ₹10,00,000', 'Above ₹10,00,000'];

const RequestEventPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '', expectedDate: '', expectedCapacity: '',
        venuePreference: '', category: 'CONFERENCE',
        budgetRange: '', description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createEventRequest({
                ...form,
                expectedCapacity: Number(form.expectedCapacity),
                requestedBy: user.id,
                requesterName: user.email.split('@')[0],
                requesterEmail: user.email
            });
            toast.success('Request submitted! Admin will review it shortly.');
            navigate('/my-requests');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally { setSaving(false); }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Request an Event</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Fill in your event requirements and our team will get back to you.
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Title</label>
                            <input type="text" required value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. TechCorp Annual Party 2025"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Date</label>
                                <input type="date" required value={form.expectedDate}
                                    onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Capacity</label>
                                <input type="number" required value={form.expectedCapacity}
                                    onChange={e => setForm({ ...form, expectedCapacity: e.target.value })}
                                    placeholder="e.g. 300"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                <select value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range</label>
                                <select value={form.budgetRange}
                                    onChange={e => setForm({ ...form, budgetRange: e.target.value })}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">— Select range —</option>
                                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Venue Preference <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input type="text" value={form.venuePreference}
                                onChange={e => setForm({ ...form, venuePreference: e.target.value })}
                                placeholder="e.g. Kalinga Convention Centre, Bhubaneswar"
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Description / Special Requirements <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea rows={4} value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Tell us more about your event — theme, special requirements, services needed etc."
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>

                        {/* Requester Info — read only */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                            <p className="text-xs font-medium text-blue-700 mb-1">Submitting as</p>
                            <p className="text-sm text-blue-900 font-semibold">{user?.email}</p>
                            <p className="text-xs text-blue-500 mt-0.5">Admin will contact you on this email</p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                                {saving ? 'Submitting...' : 'Submit Request'}
                            </button>
                            <button type="button" onClick={() => navigate('/browse')}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl text-sm font-semibold transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default RequestEventPage;