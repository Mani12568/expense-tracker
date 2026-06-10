const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database file
const db = new Database(path.join(__dirname, 'expenses.db'));

// Create the expenses table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;