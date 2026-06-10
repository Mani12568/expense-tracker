const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});