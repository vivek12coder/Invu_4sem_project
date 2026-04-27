import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Analytics from '../components/Analytics';

function SummaryCard({ title, amount, color }) {
  return (
    <div className={`rounded-2xl shadow p-6 ${color}`}>
      <p className="text-sm font-medium text-white/80">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">₹{amount.toFixed(2)}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, catRes] = await Promise.all([api.get('/expenses'), api.get('/categories')]);
        setExpenses(expRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const thisMonth = expenses
    .filter((e) => new Date(e.date) >= startOfMonth)
    .reduce((s, e) => s + e.amount, 0);
  const thisWeek = expenses
    .filter((e) => new Date(e.date) >= sevenDaysAgo)
    .reduce((s, e) => s + e.amount, 0);

  const recentExpenses = [...expenses].slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}! 👋</h2>
          <p className="text-gray-500 mt-1">Here's your expense summary</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <SummaryCard title="Total Expenses" amount={total} color="bg-indigo-600" />
          <SummaryCard title="This Month" amount={thisMonth} color="bg-blue-500" />
          <SummaryCard title="This Week" amount={thisWeek} color="bg-purple-500" />
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics</h3>
          <Analytics expenses={expenses} categories={categories} />
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
            <Link to="/expenses" className="text-indigo-600 text-sm hover:underline font-medium">
              View all →
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No expenses yet. Start adding some!</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((exp) => (
                <div key={exp._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800">{exp.title}</p>
                    <p className="text-sm text-gray-400">
                      {exp.category} • {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-indigo-600">₹{exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
