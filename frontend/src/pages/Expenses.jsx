import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ExpenseForm from '../components/ExpenseForm';
import CategoryManager from '../components/CategoryManager';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchExpenses = useCallback(async (start = '', end = '') => {
    setLoading(true);
    try {
      const params = {};
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      const res = await api.get('/expenses', { params });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [fetchExpenses]);

  const handleFilter = () => fetchExpenses(startDate, endDate);

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchExpenses('', '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setDeleteLoading(id);
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShowForm(true);
  };

  const handleFormSuccess = (updatedExpense, isEdit) => {
    if (isEdit) {
      setExpenses((prev) => prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e)));
    } else {
      setExpenses((prev) => [updatedExpense, ...prev]);
    }
    setShowForm(false);
    setEditExpense(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryManager(true)}
              className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition text-sm"
            >
              Manage Categories
            </button>
            <button
              onClick={() => { setEditExpense(null); setShowForm(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition text-sm"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>
            <button
              onClick={handleFilter}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition text-sm"
            >
              Apply Filter
            </button>
            {(startDate || endDate) && (
              <button
                onClick={handleClearFilter}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium transition text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No expenses found.</p>
              <p className="text-gray-300 text-sm mt-1">Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-800">{exp.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-indigo-600">
                        ₹{exp.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            disabled={deleteLoading === exp._id}
                            className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                          >
                            {deleteLoading === exp._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total */}
        {expenses.length > 0 && (
          <div className="mt-4 text-right text-gray-700 font-semibold">
            Total: ₹{expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editExpense}
          categories={categories}
          onSuccess={handleFormSuccess}
          onClose={handleCloseForm}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
          onCategoryAdded={(cat) => setCategories((prev) => [...prev, cat])}
        />
      )}
    </div>
  );
}
