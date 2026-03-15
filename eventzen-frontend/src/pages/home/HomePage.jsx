import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../api/authApi';
import toast from 'react-hot-toast';

const HomePage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
                <span className="text-2xl font-bold text-blue-600">EventZen</span>
                <div className="flex items-center gap-8">
                    <a href="#features" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Features</a>
                    <a href="#how" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">How it Works</a>
                    <a href="#about" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">About</a>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to={user.role === 'ADMIN' ? '/dashboard' : '/browse'}
                                className="text-sm text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition">
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    toast.success('Logged out successfully');
                                }}
                                className="border border-gray-300 hover:border-red-400 hover:text-red-500 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold transition">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-sm text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition">
                                Login
                            </Link>
                            <Link to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-8 py-28 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                        Plan Events.{' '}
                        <span className="text-blue-600">Manage Everything.</span>
                        <br />Deliver Experiences.
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        EventZen brings together venue management, vendor coordination, attendee bookings,
                        and budget tracking into one powerful platform — so you can focus on creating
                        unforgettable events.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-semibold transition shadow-md">
                            Start for Free
                        </Link>
                        <Link to="/login"
                            className="border border-gray-300 hover:border-blue-400 text-gray-700 px-8 py-3 rounded-xl text-base font-semibold transition">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Social Proof Stats */}
            <section id="about" className="bg-blue-600 py-14 px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: "10K+", label: "Events Organized" },
                        { value: "500K+", label: "Happy Attendees" },
                        { value: "1,200+", label: "Venues Listed" },
                        { value: "99.9%", label: "Platform Uptime" },
                    ].map(({ value, label }) => (
                        <div key={label}>
                            <p className="text-4xl font-bold text-white">{value}</p>
                            <p className="text-blue-200 text-sm mt-1 font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900">Everything you need to run great events</h2>
                        <p className="text-gray-500 mt-2 text-base">From first booking to final expense — EventZen has you covered.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "🏛️",
                                title: "Venue Management",
                                desc: "Browse and manage a curated list of event venues with capacity, pricing, amenities, and real-time availability.",
                                color: "bg-blue-50 border-blue-100"
                            },
                            {
                                icon: "🤝",
                                title: "Vendor Network",
                                desc: "Connect with trusted catering, audio-visual, decoration, and security vendors — all pre-linked to your venues.",
                                color: "bg-indigo-50 border-indigo-100"
                            },
                            {
                                icon: "📅",
                                title: "Event Scheduling",
                                desc: "Create and publish events in minutes. Set capacity, date, category, and let attendees discover and book instantly.",
                                color: "bg-purple-50 border-purple-100"
                            },
                            {
                                icon: "🎟️",
                                title: "Seamless Bookings",
                                desc: "Attendees book with a single click. Automatic waitlisting ensures no one misses out when an event fills up.",
                                color: "bg-green-50 border-green-100"
                            },
                            {
                                icon: "💰",
                                title: "Budget Tracking",
                                desc: "Set event budgets, log every expense, and get real-time visibility into how much you've spent and what's remaining.",
                                color: "bg-yellow-50 border-yellow-100"
                            },
                            {
                                icon: "👥",
                                title: "Attendee Management",
                                desc: "Track who actually shows up. Maintain a physical check-in registry with contact details for every event.",
                                color: "bg-red-50 border-red-100"
                            },
                        ].map(({ icon, title, desc, color }) => (
                            <div key={title} className={`${color} border rounded-2xl p-6 hover:shadow-md transition`}>
                                <span className="text-3xl">{icon}</span>
                                <h3 className="font-semibold text-gray-900 mt-3 mb-2 text-base">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how" className="py-20 px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900">How EventZen Works</h2>
                        <p className="text-gray-500 mt-2">Simple for organizers. Seamless for attendees.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                step: "01", role: "Organizer",
                                color: "bg-blue-600", light: "bg-blue-50 border-blue-100",
                                title: "Set up your venue & team",
                                desc: "Add your venues and link your vendors — catering, AV, decoration. Everything is in one place before your event begins."
                            },
                            {
                                step: "02", role: "Organizer",
                                color: "bg-blue-600", light: "bg-blue-50 border-blue-100",
                                title: "Publish your event",
                                desc: "Create the event with date, venue, and capacity. It goes live instantly for attendees to discover and register."
                            },
                            {
                                step: "03", role: "Attendee",
                                color: "bg-green-600", light: "bg-green-50 border-green-100",
                                title: "Browse and book",
                                desc: "Attendees explore upcoming events, book a seat with one click, and get instant confirmation — or join the waitlist."
                            },
                            {
                                step: "04", role: "Organizer",
                                color: "bg-blue-600", light: "bg-blue-50 border-blue-100",
                                title: "Track, manage and deliver",
                                desc: "Manage bookings, track your budget, log expenses, and maintain your attendee registry — all from one dashboard."
                            },
                        ].map(({ step, role, color, light, title, desc }) => (
                            <div key={step} className={`${light} border rounded-2xl p-6 flex gap-4 hover:shadow-sm transition`}>
                                <div className={`${color} text-white rounded-xl w-10 h-10 flex items-center justify-center text-sm font-bold shrink-0`}>
                                    {step}
                                </div>
                                <div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color} text-white`}>
                                        {role}
                                    </span>
                                    <h3 className="font-semibold text-gray-900 mt-2 mb-1">{title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-bold text-gray-900">Trusted by event organizers</h2>
                        <p className="text-gray-500 mt-2">Here's what people are saying about EventZen.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: "Romal Shetty",
                                role: "Corporate Event Manager",
                                quote: "EventZen completely changed how I manage corporate events. Tracking venues, vendors and budgets in one place saves me hours every week."
                            },
                            {
                                name: "Priya Mehta",
                                role: "Wedding Planner",
                                quote: "The vendor coordination feature is a game changer. I can see exactly which caterer and decorator is assigned to each venue without any back and forth."
                            },
                            {
                                name: "Arjun Das",
                                role: "Conference Organizer",
                                quote: "The budget tracker with auto-calculations is brilliant. I always know where my money is going and get a warning before I overspend."
                            },
                        ].map(({ name, role, quote }) => (
                            <div key={name} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">"{quote}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                                        {name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{name}</p>
                                        <p className="text-xs text-gray-400">{role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-8 bg-blue-600 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to organize your next event?
                    </h2>
                    <p className="text-blue-200 mb-8 text-base">
                        Join thousands of event organizers who trust EventZen to deliver memorable experiences.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link to="/register"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl text-base font-semibold transition shadow">
                            Create Free Account
                        </Link>
                        <Link to="/login"
                            className="border border-blue-400 text-white hover:bg-blue-500 px-8 py-3 rounded-xl text-base font-semibold transition">
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-10 px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-white font-bold text-lg">EventZen</span>
                    <p className="text-sm text-center">
                        The all-in-one platform for discovering events, managing venues, and creating memorable experiences.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <a href="#features" className="hover:text-white transition">Features</a>
                        <a href="#how" className="hover:text-white transition">How it Works</a>
                        <Link to="/register" className="hover:text-white transition">Sign Up</Link>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default HomePage;