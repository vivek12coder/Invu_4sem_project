import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-indigo-700">💰 Expense Tracker</span>
            <div className="hidden sm:flex gap-6">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-indigo-700 font-medium transition"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="text-gray-600 hover:text-indigo-700 font-medium transition"
              >
                Expenses
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="sm:hidden flex gap-4 pb-3">
          <Link to="/dashboard" className="text-gray-600 hover:text-indigo-700 font-medium text-sm">
            Dashboard
          </Link>
          <Link to="/expenses" className="text-gray-600 hover:text-indigo-700 font-medium text-sm">
            Expenses
          </Link>
        </div>
      </div>
    </nav>
  );
}
