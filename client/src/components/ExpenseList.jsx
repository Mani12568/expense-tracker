function ExpenseList({ expenses, onEdit, onDelete }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-700',
      Transport: 'bg-blue-100 text-blue-700',
      Bills: 'bg-red-100 text-red-700',
      Entertainment: 'bg-purple-100 text-purple-700',
      Shopping: 'bg-pink-100 text-pink-700',
      Health: 'bg-green-100 text-green-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <p className="text-4xl mb-3">💸</p>
        <p className="text-gray-500 font-medium">No expenses found</p>
        <p className="text-gray-400 text-sm mt-1">Add your first expense above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Date</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Category</th>
              <th className="text-left px-4 py-3 text-gray-600 font-semibold">Note</th>
              <th className="text-right px-4 py-3 text-gray-600 font-semibold">Amount</th>
              <th className="text-center px-4 py-3 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`border-b last:border-0 hover:bg-gray-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <td className="px-4 py-3 text-gray-600">{expense.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{expense.note || '—'}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-700">
                  {formatAmount(expense.amount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-500 hover:text-blue-700 font-medium mr-3 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-500 hover:text-red-700 font-medium transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;