// ─────────────────────────────────────────────────────────────────────────────
// OLD CommonJS:                      NEW ES Modules:
//   const express = require(...)   →   import express from 'express'
//   const cors    = require(...)   →   import cors from 'cors'
//   const routes  = require(...)   →   import todoRoutes from './routes/todos.js'
//
// "default import"  → import express from 'express'   (no curly braces)
// "named import"    → import { Router } from 'express' (with curly braces)
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/todos', todoRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ Todo API is running! (ES Modules)', version: '2.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;