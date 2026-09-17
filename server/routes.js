const express = require('express');
const router = express.Router();
const pool = require('./database');
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category && category !== 'All') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (startDate) {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const totalResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE date >= $1',
      [startOfMonth]
    );

    const perCategoryResult = await pool.query(
      'SELECT category, COALESCE(SUM(amount), 0) as total FROM expenses WHERE date >= $1 GROUP BY category',
      [startOfMonth]
    );

    const highestResult = await pool.query(
      'SELECT * FROM expenses ORDER BY amount DESC LIMIT 1'
    );

    res.json({
      totalThisMonth: totalResult.rows[0].total,
      perCategory: perCategoryResult.rows,
      highest: highestResult.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;

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
    await pool.query(
      'INSERT INTO expenses (id, amount, category, date, note) VALUES ($1, $2, $3, $4, $5)',
      [id, amount, category, date, note || '']
    );

    const newExpenseResult = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    res.status(201).json(newExpenseResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const { id } = req.params;

    const existingResult = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await pool.query(
      'UPDATE expenses SET amount = $1, category = $2, date = $3, note = $4 WHERE id = $5',
      [amount, category, date, note || '', id]
    );

    const updatedResult = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    res.json(updatedResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;