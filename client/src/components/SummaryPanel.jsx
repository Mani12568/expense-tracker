function SummaryPanel({ summary }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-600 font-medium">Total This Month</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">
          {formatAmount(summary?.totalThisMonth)}
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-600 font-medium">Highest Expense</p>
        <p className="text-2xl font-bold text-red-700 mt-1">
          {formatAmount(summary?.highest?.amount)}
        </p>
        {summary?.highest && (
          <p className="text-xs text-red-500 mt-1">
            {summary.highest.category} — {summary.highest.note || 'No note'}
          </p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-600 font-medium">By Category</p>
        {summary?.perCategory?.length > 0 ? (
          summary.perCategory.map((item) => (
            <div key={item.category} className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">{item.category}</span>
              <span className="font-medium text-green-700">{formatAmount(item.total)}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 mt-1">No expenses this month</p>
        )}
      </div>
    </div>
  );
}

export default SummaryPanel;