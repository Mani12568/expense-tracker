const express = require('express');
const router = express.Router();
const db = require('./database');
const { v4: uuidv4 } = require('uuid');

// GET all expenses (with optional filters)
router.get('/', (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC';
    const expenses = db.prepare(query).all(...params);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET summary
router.get('/summary', (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const totalThisMonth = db.prepare(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE date >= ?'
    ).get(startOfMonth);

    const perCategory = db.prepare(
      'SELECT category, COALESCE(SUM(amount), 0) as total FROM expenses WHERE date >= ? GROUP BY category'
    ).all(startOfMonth);

    const highest = db.prepare(
      'SELECT * FROM expenses ORDER BY amount DESC LIMIT 1'
    ).get();

    res.json({
      totalThisMonth: totalThisMonth.total,
      perCategory,
      highest: highest || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// POST add new expense
router.post('/', (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const id = uuidv4();
    db.prepare(
      'INSERT INTO expenses (id, amount, category, date, note) VALUES (?, ?, ?, ?, ?)'
    ).run(id, amount, category, date, note || '');

    const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// PUT update expense
router.put('/:id', (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    db.prepare(
      'UPDATE expenses SET amount = ?, category = ?, date = ?, note = ? WHERE id = ?'
    ).run(amount, category, date, note || '', id);

    const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE expense
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;