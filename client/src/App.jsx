import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseFilter from './components/ExpenseFilter';
import SummaryPanel from './components/SummaryPanel';
import ExpenseChart from './components/ExpenseChart';

const API = 'https://expense-tracker-swn8.onrender.com/api/expenses';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    startDate: '',
    endDate: ''
  });

  // Fetch expenses whenever filters change
  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await axios.get(API, { params });
      setExpenses(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch expenses. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch summary');
    }
  };

  const handleAddOrUpdate = async (formData) => {
    try {
      if (editingExpense) {
        await axios.put(`${API}/${editingExpense.id}`, formData);
      } else {
        await axios.post(API, formData);
      }
      setEditingExpense(null);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchExpenses();
      fetchSummary();
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['Date', 'Category', 'Amount', 'Note'];
    const rows = expenses.map(e => [e.date, e.category, e.amount, e.note || '']);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4 shadow">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">💰 Expense Tracker</h1>
            <p className="text-blue-200 text-sm">Track your daily spending</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
          >
            ⬇️ Export CSV
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Summary Panel */}
        <SummaryPanel summary={summary} />

        {/* Chart */}
        <ExpenseChart perCategory={summary?.perCategory} />

        {/* Add/Edit Form */}
        <ExpenseForm
          onSubmit={handleAddOrUpdate}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
        />

        {/* Filters */}
        <ExpenseFilter
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading expenses...</div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;