# Expense Tracker

A simple full-stack web app to track daily expenses. Built with React on the frontend and Node.js + Express on the backend, with SQLite for storing data.

This is my submission for the Studio Graphene Full Stack Developer Assessment — I chose Exercise 2 (Mini Expense Tracker).

---

## Live Demo
- Frontend: (add after deployment)
- Backend API: (add after deployment)

---

## Tech Stack

**Frontend**
- React (Vite) — I used Vite instead of CRA because it starts faster
- Tailwind CSS — makes styling much quicker without writing lots of CSS
- Axios — for making API calls to the backend
- Recharts — easy to use chart library that works well with React

**Backend**
- Node.js + Express — simple and straightforward for building REST APIs
- better-sqlite3 — I chose SQLite so data doesn't reset every time the server restarts, and it needs zero configuration compared to MongoDB or PostgreSQL
- uuid — to generate unique IDs for each expense
- nodemon — auto restarts server during development

---

## How to Run Locally

You'll need Node.js installed (v18 or higher).

**1. Clone the repo**
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

**2. Start the backend**
```bash
cd server
npm install
npm run dev
```
Backend runs on http://localhost:5000

**3. Start the frontend (open a new terminal)**
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173

**4. Open in browser**

---

## API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /api/expenses | Get all expenses, supports category and date filters |
| GET | /api/expenses/summary | Get total this month, per category totals, highest expense |
| POST | /api/expenses | Add a new expense |
| PUT | /api/expenses/:id | Update an existing expense |
| DELETE | /api/expenses/:id | Delete an expense |

**Optional query params for GET /api/expenses**
- `category` — e.g. Food, Transport
- `startDate` — format YYYY-MM-DD
- `endDate` — format YYYY-MM-DD

---

## Features

**Must have (all done)**
- Add expense with amount, category, date, optional note
- View all expenses sorted by newest first
- Edit and delete expenses
- Filter by category and date range (this month, last month, custom)
- Summary panel showing total this month, breakdown by category, highest expense

**Should have (all done)**
- Pie chart showing spending by category
- Currency formatted in Indian Rupees ₹
- Form validation — no negative amounts, no future dates, category is required

**Bonus**
- Export expenses as CSV
- Data persists with SQLite — doesn't reset on server restart

---

## What I'd Improve With More Time

- Add budget limits per category with a warning when you go over
- Write some backend tests with Jest
- Add a monthly comparison chart to see spending trends
- Make the date filter remember your last selection
- Deploy properly with environment variables instead of hardcoded localhost URLs
- Maybe add a simple login so different people can use it separately            