import { useState } from 'react';
import api from '../api/axios';

export default function CategoryManager({ categories, onClose, onCategoryAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Category name is required');
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/categories', { name: name.trim() });
      onCategoryAdded(res.data);
      setName('');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add category';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Manage Categories</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
        </div>

        {/* Add new category form */}
        <form onSubmit={handleAdd} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); setServerError(''); }}
              placeholder="e.g. Entertainment"
              className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                error ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-60"
            >
              {loading ? '...' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          {serverError && <p className="text-red-500 text-xs mt-1">{serverError}</p>}
        </form>

        {/* Existing categories */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-3">Your Categories ({categories.length})</p>
          <div className="max-h-56 overflow-y-auto space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-800 font-medium">{cat.name}</span>
                {cat.isDefault && (
                  <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Default</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
