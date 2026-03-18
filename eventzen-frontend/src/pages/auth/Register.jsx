import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import toast from 'react-hot-toast';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'ATTENDEE' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(form);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
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
                        Your events,<br />perfectly organized.
                    </h2>
                    <p className="text-blue-200 text-base leading-relaxed max-w-sm">
                        Join thousands of event organizers and attendees who trust EventZen to create memorable experiences.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {[
                            { value: "10K+", label: "Events Organized" },
                            { value: "500K+", label: "Happy Attendees" },
                            { value: "1,200+", label: "Venues Listed" },
                            { value: "99.9%", label: "Platform Uptime" },
                        ].map(({ value, label }) => (
                            <div key={label} className="bg-white bg-opacity-10 rounded-xl px-4 py-3">
                                <p className="text-white font-bold text-xl">{value}</p>
                                <p className="text-blue-200 text-xs mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-blue-300 text-xs">© 2026 EventZen. All rights reserved.</p>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="text-2xl font-bold text-blue-600">EventZen</Link>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-gray-500 mt-1">Get started with EventZen for free</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                <input type="text" required value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Sankar N"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                                <input type="email" required value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} required
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        placeholder="Min. 6 characters"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12" />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* 3 Role Cards */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">I am joining as</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        {
                                            value: 'ATTENDEE',
                                            icon: '🎟️',
                                            label: 'Attendee',
                                            desc: 'Browse & book events'
                                        },
                                        {
                                            value: 'CLIENT',
                                            icon: '🤝',
                                            label: 'Client',
                                            desc: 'Request & organize events'
                                        },
                                        {
                                            value: 'ADMIN',
                                            icon: '🏛️',
                                            label: 'Organizer',
                                            desc: 'Manage the platform'
                                        },
                                    ].map(({ value, icon, label, desc }) => (
                                        <button type="button" key={value}
                                            onClick={() => setForm({ ...form, role: value })}
                                            className={`border-2 rounded-xl p-3 text-left transition
                                                ${form.role === value
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'}`}>
                                            <span className="text-2xl">{icon}</span>
                                            <p className={`text-sm font-semibold mt-1
                                                ${form.role === value ? 'text-blue-700' : 'text-gray-800'}`}>
                                                {label}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5 leading-tight">{desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;