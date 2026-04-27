import { useState } from 'react';
import api from '../api/axios';

export default function ExpenseForm({ expense, categories, onSuccess, onClose }) {
  const isEdit = !!expense;
  const [form, setForm] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    category: expense?.category || (categories[0]?.name || ''),
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount && form.amount !== 0) errs.amount = 'Amount is required';
    else if (isNaN(form.amount) || Number(form.amount) < 0) errs.amount = 'Amount must be a positive number';
    if (!form.category) errs.category = 'Category is required';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await api.put(`/expenses/${expense._id}`, { ...form, amount: Number(form.amount) });
      } else {
        res = await api.post('/expenses', { ...form, amount: Number(form.amount) });
      }
      onSuccess(res.data, isEdit);
    } catch (err) {
      const msg = err.response?.data?.message || 'An error occurred. Please try again.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">{isEdit ? 'Edit Expense' : 'Add Expense'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.title ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.amount ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white ${
                errors.category ? 'border-red-400' : 'border-gray-300'
              }`}
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.date ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-60"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
