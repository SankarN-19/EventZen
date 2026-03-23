import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(form);
            const { token, email, role, id, name } = res.data.data;
            login(token, { email, role, id, name });
            toast.success(`Welcome back, ${name}!`);
            navigate(
                role === 'ADMIN' ? '/dashboard' :
                    role === 'CLIENT' ? '/client-dashboard' :
                        '/attendee-dashboard'
            );
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-between p-12">
                <div>
                    <Link to="/" className="text-white text-2xl font-bold">EventZen</Link>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Manage events<br />like never before.
                    </h2>
                    <p className="text-blue-200 text-base leading-relaxed max-w-sm">
                        From venue booking to budget tracking — everything you need to deliver unforgettable events is right here.
                    </p>

                    {/* Feature pills */}
                    <div className="mt-8 flex flex-col gap-3">
                        {[
                            { icon: "🏛️", text: "Venue & Vendor Management" },
                            { icon: "🎟️", text: "Smart Booking with Waitlisting" },
                            { icon: "💰", text: "Real-time Budget Tracking" },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl px-4 py-3">
                                <span className="text-xl">{icon}</span>
                                <span className="text-white text-sm font-medium">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-blue-300 text-xs">© 2026 EventZen. All rights reserved.</p>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-gray-50">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="text-2xl font-bold text-blue-600">EventZen</Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-gray-500 mt-1">Sign in to your EventZen account</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                                <input type="email" required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12" />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm shadow-sm">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                                    Create one free
                                </Link>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6">
                        By signing in you agree to EventZen's Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;