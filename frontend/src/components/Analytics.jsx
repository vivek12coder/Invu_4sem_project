import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

function getCategoryData(expenses) {
  const map = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
}

function getMonthlyData(expenses) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
      total: 0,
    });
  }

  expenses.forEach((e) => {
    const d = new Date(e.date);
    const entry = months.find((m) => m.year === d.getFullYear() && m.month === d.getMonth());
    if (entry) entry.total += e.amount;
  });

  return months.map((m) => ({ month: m.label, amount: parseFloat(m.total.toFixed(2)) }));
}

export default function Analytics({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg">No expense data to display.</p>
        <p className="text-sm mt-1">Add some expenses to see your analytics.</p>
      </div>
    );
  }

  const categoryData = getCategoryData(expenses);
  const monthlyData = getMonthlyData(expenses);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pie Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Expenses by Category</h4>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">Monthly Spending (Last 6 Months)</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
            <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
