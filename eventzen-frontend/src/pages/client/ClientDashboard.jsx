import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getMyEventRequests } from '../../api/eventApi';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700'
};

const ClientDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyEventRequests(user.id)
            .then(res => setRequests(res.data.data || []))
            .finally(() => setLoading(false));
    }, []);

    const pending = requests.filter(r => r.status === 'PENDING').length;
    const approved = requests.filter(r => r.status === 'APPROVED').length;
    const rejected = requests.filter(r => r.status === 'REJECTED').length;

    return (
        <Layout>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-8 py-8 mb-8 flex items-center justify-between">
                <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Welcome back 👋</p>
                    <h1 className="text-2xl font-bold text-white">{user?.email?.split('@')[0]?.charAt(0).toUpperCase() + user?.email?.split('@')[0]?.slice(1)}</h1>
                    <p className="text-blue-200 text-sm mt-1">Manage your event requests from here</p>
                </div>
                <Link to="/request-event"
                    className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl text-sm font-bold transition shadow-md">
                    + New Request
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Requests', value: requests.length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { label: 'Approved', value: approved, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { label: 'Pending Review', value: pending, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} className={`${bg} border ${border} rounded-2xl p-5`}>
                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                        <p className={`text-4xl font-bold mt-1 ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                {/* Request New Event */}
                <Link to="/request-event"
                    className="group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-6 transition flex gap-5 items-start">
                    <div className="bg-blue-100 group-hover:bg-blue-600 rounded-xl p-4 transition">
                        <span className="text-2xl">📋</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1">Request an Event</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Submit your event requirements — date, venue, capacity, budget. Our team will review and get back to you.
                        </p>
                        <span className="inline-block mt-3 text-blue-600 text-xs font-semibold group-hover:underline">
                            Submit request →
                        </span>
                    </div>
                </Link>

                {/* View My Requests */}
                <Link to="/my-requests"
                    className="group bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md rounded-2xl p-6 transition flex gap-5 items-start">
                    <div className="bg-purple-100 group-hover:bg-purple-600 rounded-xl p-4 transition">
                        <span className="text-2xl">📁</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base mb-1">My Requests</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Track the status of all your submitted event requests. See admin responses and notes in real time.
                        </p>
                        <span className="inline-block mt-3 text-purple-600 text-xs font-semibold group-hover:underline">
                            View all requests →
                        </span>
                    </div>
                </Link>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-800">Recent Requests</h2>
                    <Link to="/my-requests" className="text-blue-600 text-xs font-semibold hover:underline">
                        View all
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-gray-500 text-sm font-medium">No requests yet</p>
                        <p className="text-gray-400 text-xs mt-1 mb-4">Submit your first event request to get started</p>
                        <Link to="/request-event"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                            Request an Event
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {requests.slice(0, 5).map(r => (
                            <div key={r._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-sm">
                                        {r.category === 'WEDDING' ? '💒' :
                                            r.category === 'CONCERT' ? '🎵' :
                                                r.category === 'CONFERENCE' ? '🎤' :
                                                    r.category === 'CORPORATE' ? '🏢' : '🎉'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(r.expectedDate).toLocaleDateString('en-IN')} · {r.expectedCapacity} guests · {r.category}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[r.status]}`}>
                                        {r.status}
                                    </span>
                                    {r.adminNote && (
                                        <span className="text-xs text-gray-400 italic max-w-xs truncate hidden md:block">
                                            "{r.adminNote}"
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* How it works */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">How event requests work</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { step: '01', title: 'Submit Request', desc: 'Fill in your event details and requirements', icon: '📋' },
                        { step: '02', title: 'Admin Reviews', desc: 'Our team reviews your request within 24 hours', icon: '🔍' },
                        { step: '03', title: 'Get Response', desc: 'Receive approval or feedback with an admin note', icon: '💬' },
                        { step: '04', title: 'Event is Created', desc: 'Admin creates the event and it goes live', icon: '🎉' },
                    ].map(({ step, title, desc, icon }) => (
                        <div key={step} className="flex gap-3">
                            <div className="bg-blue-600 text-white rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0">
                                {step}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{title}</p>
                                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ClientDashboard;