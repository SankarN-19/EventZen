import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllEventRequests, approveEventRequest, rejectEventRequest, deleteEventRequest } from '../../api/eventApi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
};

const EventRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [noteModal, setNoteModal] = useState(null); // { id, action }
    const [note, setNote] = useState('');

    const fetchRequests = async () => {
        try {
            const res = await getAllEventRequests(filter);
            setRequests(res.data.data || []);
        } catch { toast.error('Failed to fetch requests'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, [filter]);

    const handleAction = async () => {
        try {
            if (noteModal.action === 'approve') {
                await approveEventRequest(noteModal.id, note);
                toast.success('Request approved');
            } else {
                await rejectEventRequest(noteModal.id, note);
                toast.success('Request rejected');
            }
            setNoteModal(null);
            setNote('');
            fetchRequests();
        } catch { toast.error('Action failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this request?')) return;
        try {
            await deleteEventRequest(id);
            toast.success('Request deleted');
            fetchRequests();
        } catch { toast.error('Failed to delete'); }
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Event Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Review and respond to client event requests</p>
                </div>
                {/* Filter tabs */}
                <div className="flex gap-2">
                    {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition
                                ${filter === s
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20 text-gray-400 text-sm">No requests found</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {requests.map(r => (
                        <div key={r._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{r.title}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Submitted by {r.requesterEmail} · {new Date(r.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${STATUS_COLORS[r.status]}`}>
                                    {r.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {[
                                    { label: 'Date', value: new Date(r.expectedDate).toLocaleDateString('en-IN') },
                                    { label: 'Capacity', value: `${r.expectedCapacity} guests` },
                                    { label: 'Category', value: r.category },
                                    { label: 'Budget', value: r.budgetRange || '—' },
                                    { label: 'Venue', value: r.venuePreference || '—' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                                        <p className="text-xs text-gray-400">{label}</p>
                                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {r.description && (
                                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-4 leading-relaxed">
                                    {r.description}
                                </p>
                            )}

                            {r.adminNote && (
                                <div className={`rounded-lg px-3 py-2 text-xs mb-4
                                    ${r.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                    <span className="font-semibold">Your note: </span>{r.adminNote}
                                </div>
                            )}

                            {r.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <button onClick={() => { setNoteModal({ id: r._id, action: 'approve' }); setNote(''); }}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-semibold transition">
                                        ✓ Approve
                                    </button>
                                    <button onClick={() => { setNoteModal({ id: r._id, action: 'reject' }); setNote(''); }}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-xs font-semibold transition">
                                        ✗ Reject
                                    </button>
                                    <button onClick={() => handleDelete(r._id)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs font-semibold transition">
                                        Delete
                                    </button>
                                </div>
                            )}

                            {r.status !== 'PENDING' && (
                                <button onClick={() => handleDelete(r._id)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-semibold transition">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Note Modal */}
            {noteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            {noteModal.action === 'approve' ? '✓ Approve Request' : '✗ Reject Request'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Add a note for the client — this will be visible to them.
                        </p>
                        <textarea rows={3} value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder={noteModal.action === 'approve'
                                ? "e.g. Great! We'll be in touch to finalize the details."
                                : "e.g. Sorry, the requested date is unavailable."}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4" />
                        <div className="flex gap-3">
                            <button onClick={handleAction}
                                className={`flex-1 text-white py-2.5 rounded-xl text-sm font-semibold transition
                                    ${noteModal.action === 'approve'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-500 hover:bg-red-600'}`}>
                                {noteModal.action === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                            </button>
                            <button onClick={() => setNoteModal(null)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default EventRequestsPage;