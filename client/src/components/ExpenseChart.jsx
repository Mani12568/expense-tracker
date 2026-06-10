import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#f97316', '#ef4444', '#a855f7', '#ec4899', '#22c55e', '#6b7280'];

function ExpenseChart({ perCategory }) {
  if (!perCategory || perCategory.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center mb-6">
        <p className="text-3xl mb-2">📊</p>
        <p className="text-gray-400 text-sm">No data to display yet</p>
      </div>
    );
  }

  const data = perCategory.map((item) => ({
    name: item.category,
    value: parseFloat(item.total.toFixed(2))
  }));

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 Spending by Category</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseChart;