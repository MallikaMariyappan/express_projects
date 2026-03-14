// ─────────────────────────────────────────────────────────────────────────────
// OLD: const express = require('express');
//      const router = express.Router();
//      module.exports = router;
//
// NEW: import express from 'express';
//      const router = express.Router();
//      export default router;   ← "default export" — only ONE per file
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
} from '../controllers/todoController.js';
import { validateCreate, validateUpdate } from '../middleware/validate.js';

const router = express.Router();

router.get('/',                    getAllTodos);
router.get('/:id',                 getTodoById);
router.post('/',   validateCreate, createTodo);
router.put('/:id', validateUpdate, updateTodo);
router.patch('/:id/toggle',        toggleTodo);
router.delete('/completed',        clearCompleted); // must be BEFORE /:id
router.delete('/:id',              deleteTodo);

export default router;