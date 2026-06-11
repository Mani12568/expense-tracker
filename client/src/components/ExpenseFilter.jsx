const CATEGORIES = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'];

function ExpenseFilter({ filters, onFilterChange }) {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0];
  const firstDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    .toISOString().split('T')[0];
  const lastDayOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    .toISOString().split('T')[0];

  const handleQuickFilter = (type) => {
    if (type === 'thisMonth') {
      onFilterChange({ ...filters, startDate: firstDayOfMonth, endDate: today });
    } else if (type === 'lastMonth') {
      onFilterChange({ ...filters, startDate: firstDayOfLastMonth, endDate: lastDayOfLastMonth });
    } else {
      onFilterChange({ ...filters, startDate: '', endDate: '' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">🔍 Filter Expenses</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">From Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">To Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Quick Select</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickFilter('thisMonth')}
              className="flex-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-2 text-xs font-medium hover:bg-blue-100 transition"
            >
              This Month
            </button>
            <button
              onClick={() => handleQuickFilter('lastMonth')}
              className="flex-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg px-2 py-2 text-xs font-medium hover:bg-gray-100 transition"
            >
              Last Month
            </button>
            <button
              onClick={() => handleQuickFilter('all')}
              className="flex-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg px-2 py-2 text-xs font-medium hover:bg-gray-100 transition"
            >
              All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseFilter;