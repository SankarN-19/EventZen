import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../api/authApi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const { user, login, token } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState(user?.name || user?.email?.split('@')[0] || '');

    const roleColors = {
        ADMIN: 'bg-blue-100 text-blue-700',
        CLIENT: 'bg-purple-100 text-purple-700',
        ATTENDEE: 'bg-green-100 text-green-700'
    };

    const roleDescriptions = {
        ADMIN: 'Full platform access — manage venues, events, bookings and more',
        CLIENT: 'Submit event requests and track their status',
        ATTENDEE: 'Browse and book upcoming events'
    };

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Name cannot be empty');
        setSaving(true);
        try {
            await updateUser(user.id, { name, email: user.email });
            // Update local storage and context
            const updatedUser = { ...user, name };
            login(token, updatedUser);
            toast.success('Profile updated successfully');
            setEditing(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally { setSaving(false); }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
                </div>

                {/* Avatar + Role Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center text-white text-2xl font-bold">
                        {(user?.name || user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {user?.name || user?.email?.split('@')[0]}
                        </h2>
                        <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
                        <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-semibold ${roleColors[user?.role]}`}>
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-base font-semibold text-gray-800">Account Information</h3>
                        {!editing && (
                            <button onClick={() => setEditing(true)}
                                className="text-sm text-blue-600 hover:underline font-medium">
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                            {editing ? (
                                <input type="text" value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            ) : (
                                <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-xl px-4 py-2.5">
                                    {user?.name || '—'}
                                </p>
                            )}
                        </div>

                        {/* Email — always read only */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                            <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                {user?.email}
                                <span className="text-xs text-gray-400">Cannot be changed</span>
                            </p>
                        </div>

                        {/* Role — read only */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                            <p className="text-sm font-medium text-gray-800 bg-gray-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                {user?.role}
                                <span className="text-xs text-gray-400">Assigned at registration</span>
                            </p>
                        </div>
                    </div>

                    {editing && (
                        <div className="flex gap-3 mt-5">
                            <button onClick={handleSave} disabled={saving}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => { setEditing(false); setName(user?.name || ''); }}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold transition">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Role Info Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Your Access Level</p>
                    <p className="text-sm text-blue-800">{roleDescriptions[user?.role]}</p>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;