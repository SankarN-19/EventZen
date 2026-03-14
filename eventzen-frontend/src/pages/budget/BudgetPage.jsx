import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllEvents } from '../../api/eventApi';
import { createBudget, getBudgetByEvent, addExpense, deleteExpense } from '../../api/budgetApi';
import toast from 'react-hot-toast';

const BudgetPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [budget, setBudget] = useState(null);
    const [totalBudget, setTotalBudget] = useState('');
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [expense, setExpense] = useState({ category: '', description: '', amount: '', date: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllEvents({}).then(res => setEvents(res.data.data.content || []));
    }, []);

    const fetchBudget = async (eventId) => {
        try {
            const res = await getBudgetByEvent(eventId);
            setBudget(res.data.data);
        } catch { setBudget(null); }
    };

    const handleSelectEvent = (id) => {
        setSelectedEvent(id);
        if (id) fetchBudget(id);
        else setBudget(null);
    };

    const handleCreateBudget = async () => {
        if (!totalBudget) return toast.error('Enter total budget');
        try {
            await createBudget({ eventId: selectedEvent, totalBudget: Number(totalBudget) });
            toast.success('Budget created');
            fetchBudget(selectedEvent);
            setTotalBudget('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create budget');
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addExpense(budget._id, { ...expense, amount: Number(expense.amount) });
            toast.success('Expense added');
            setShowExpenseForm(false);
            setExpense({ category: '', description: '', amount: '', date: '' });
            fetchBudget(selectedEvent);
        } catch { toast.error('Failed to add expense'); }
        finally { setLoading(false); }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            await deleteExpense(budget._id, expenseId);
            toast.success('Expense deleted');
            fetchBudget(selectedEvent);
        } catch { toast.error('Failed to delete expense'); }
    };

    const pct = budget ? Math.min((budget.totalSpent / budget.totalBudget) * 100, 100).toFixed(1) : 0;

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
                <p className="text-gray-500 text-sm mt-1">Track event budgets and expenses</p>
            </div>

            {/* Event Selector */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Event</label>
                <select value={selectedEvent} onChange={e => handleSelectEvent(e.target.value)}
                    className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">— Choose an event —</option>
                    {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                </select>
            </div>

            {selectedEvent && !budget && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
                    <p className="text-sm text-gray-600 mb-3">No budget found for this event. Create one:</p>
                    <div className="flex gap-3 items-center">
                        <input type="number" placeholder="Total Budget (₹)"
                            value={totalBudget}
                            onChange={e => setTotalBudget(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
                        <button onClick={handleCreateBudget}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                            Create Budget
                        </button>
                    </div>
                </div>
            )}

            {budget && (
                <>
                    {/* Budget Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                            { label: 'Total Budget', value: `₹${budget.totalBudget?.toLocaleString()}`, color: 'text-blue-600' },
                            { label: 'Total Spent', value: `₹${budget.totalSpent?.toLocaleString()}`, color: 'text-red-500' },
                            { label: 'Remaining', value: `₹${budget.remaining?.toLocaleString()}`, color: 'text-green-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Budget Used</span>
                            <span className="font-semibold text-gray-800">{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className={`h-3 rounded-full transition-all ${Number(pct) > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${pct}%` }} />
                        </div>
                    </div>

                    {/* Expenses */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-800">Expenses</h2>
                            <button onClick={() => setShowExpenseForm(!showExpenseForm)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                                + Add Expense
                            </button>
                        </div>

                        {showExpenseForm && (
                            <form onSubmit={handleAddExpense} className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Category', key: 'category', type: 'text' },
                                        { label: 'Amount (₹)', key: 'amount', type: 'number' },
                                        { label: 'Description', key: 'description', type: 'text' },
                                        { label: 'Date', key: 'date', type: 'date' },
                                    ].map(({ label, key, type }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                                            <input type={type} required
                                                value={expense[key]}
                                                onChange={e => setExpense({ ...expense, [key]: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 mt-3">
                                    <button type="submit" disabled={loading}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                                        {loading ? 'Adding...' : 'Add'}
                                    </button>
                                    <button type="button" onClick={() => setShowExpenseForm(false)}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-3 text-left">Category</th>
                                    <th className="px-6 py-3 text-left">Description</th>
                                    <th className="px-6 py-3 text-left">Amount</th>
                                    <th className="px-6 py-3 text-left">Date</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {budget.expenses?.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No expenses yet</td></tr>
                                ) : budget.expenses?.map(ex => (
                                    <tr key={ex._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{ex.category}</td>
                                        <td className="px-6 py-4 text-gray-500">{ex.description || '—'}</td>
                                        <td className="px-6 py-4 text-red-500 font-medium">₹{ex.amount?.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(ex.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDeleteExpense(ex._id)}
                                                className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </Layout>
    );
};

export default BudgetPage;