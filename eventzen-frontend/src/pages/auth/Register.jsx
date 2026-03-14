import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import toast from 'react-hot-toast';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ATTENDEE' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', form);
        setLoading(true);
        try {
            await registerUser(form);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-blue-600">EventZen</h1>
                    <p className="text-gray-500 mt-1 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" required
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Min. 6 characters" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="ATTENDEE">Attendee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 mt-2">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;