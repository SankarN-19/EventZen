import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getMyEventRequests } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
};

const MyRequestsPage = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyEventRequests(user.id)
            .then(res => setRequests(res.data.data || []))
            .catch(() => toast.error('Failed to load requests'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <Layout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Event Requests</h1>
                    <p className="text-gray-500 text-sm mt-1">Track the status of your submitted requests</p>
                </div>
                <Link to="/request-event"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                    + New Request
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-sm mb-4">You haven't submitted any event requests yet.</p>
                    <Link to="/request-event"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                        Submit your first request
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {requests.map(r => (
                        <div key={r._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_COLORS[r.status]}`}>
                                    {r.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{r.title}</h3>
                            <div className="mt-2 space-y-1">
                                <p className="text-xs text-gray-500">
                                    📅 {new Date(r.expectedDate).toLocaleDateString('en-IN')}
                                </p>
                                <p className="text-xs text-gray-500">👥 {r.expectedCapacity} guests</p>
                                <p className="text-xs text-gray-500">🏷️ {r.category}</p>
                                {r.budgetRange && <p className="text-xs text-gray-500">💰 {r.budgetRange}</p>}
                                {r.venuePreference && <p className="text-xs text-gray-500">🏛️ {r.venuePreference}</p>}
                            </div>
                            {r.adminNote && (
                                <div className={`mt-3 rounded-lg px-3 py-2 text-xs
                                    ${r.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                    <span className="font-semibold">Admin note: </span>{r.adminNote}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default MyRequestsPage;