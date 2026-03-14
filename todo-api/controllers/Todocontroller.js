// todoController.js — CORRECTED

import * as store from '../models/todoStore.js';
// "import everything" from todoStore as a namespace object called store.
// Now: store.getAll(), store.create(), store.remove() etc.
// Alternative to importing each function individually.

// ─── GET /api/todos ────────────────────────────────────────────────────────────

export const getAllTodos = (req, res) => {
  const filter = {};

  if (req.query.completed !== undefined) {
    filter.completed = req.query.completed === "true";
    // req.query.completed arrives as a STRING "true" or "false" from the URL.
    // === "true" converts it to a real boolean: true or false.
    // This boolean is what we pass to store.getAll() and compare with t.completed.
  }

  if (req.query.priority) {
    filter.priority = req.query.priority;
  }

  const todos = store.getAll(filter);
  res.status(200).json({ success: true, count: todos.length, data: todos });
};

// ─── GET /api/todos/:id ────────────────────────────────────────────────────────

export const getTodoById = (req, res) => {
  const todo = store.getById(req.params.id);
  // req.params.id = the :id segment from the URL.
  // GET /api/todos/abc123 → req.params.id = "abc123"

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: `Todo with id '${req.params.id}' not found.`,
    });
    // "return" stops execution here. Without it, the code would continue
    // and try to send ANOTHER response → "Cannot set headers after they are sent" crash.
  }

  res.status(200).json({ success: true, data: todo });
};

// ─── POST /api/todos ───────────────────────────────────────────────────────────

export const createTodo = (req, res) => {
  const { title, description, priority } = req.body;
  // By this point, validateCreate already confirmed title exists and is valid.
  // It also already trimmed it: req.body.title = title.trim()
  // So we don't need .trim() again here.

  const todo = store.create({ title, description, priority });
  res.status(201).json({
    success: true,
    message: "Todo created successfully.",
    data: todo,
  });
  // 201 = Created. Use this instead of 200 when something NEW was made.
};

// ─── PUT /api/todos/:id ────────────────────────────────────────────────────────

export const updateTodo = (req, res) => {
  const { title, description, completed, priority } = req.body;

  const updated = store.update(req.params.id, {
    ...(title !== undefined       && { title }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined   && { completed }),
    ...(priority !== undefined    && { priority }),
  });
  // This pattern: (condition && { key: value }) → if condition is false, gives false.
  // Spreading false = nothing. So only DEFINED fields get included.
  // Example: if title is undefined, { title } is NOT added to the update object.
  // This prevents accidentally overwriting existing values with undefined.

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Todo with id '${req.params.id}' not found.`,
    });
  }

  res.status(200).json({ success: true, message: "Todo updated successfully.", data: updated });
};

// ─── PATCH /api/todos/:id/toggle ──────────────────────────────────────────────

export const toggleTodo = (req, res) => {
  const existing = store.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: `Todo '${req.params.id}' not found.` });
  }

  const updated = store.update(req.params.id, { completed: !existing.completed });
  // !existing.completed flips the boolean: true → false, false → true
  // No request body needed — we already have the current state from getById.

  res.status(200).json({
    success: true,
    message: `Todo marked as ${updated.completed ? "completed" : "incomplete"}.`,
    // Ternary: condition ? valueIfTrue : valueIfFalse
    data: updated,
  });
};

// ─── DELETE /api/todos/:id ─────────────────────────────────────────────────────

export const deleteTodo = (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: `Todo '${req.params.id}' not found.` });
  }
  res.status(200).json({ success: true, message: "Todo deleted successfully.", data: deleted });
};

// ─── DELETE /api/todos ─────────────────────────────────────────────────────────

export const deleteAllTodos = (req, res) => {
  // store.removeAll() doesn't exist in your new store — clearCompleted does.
  // But we want to delete ALL, not just completed. So we clear everything differently:
  store.clearCompleted();   // removes completed ones
  // Actually for deleteAll, let's just reassign — but since we don't expose that,
  // call clearCompleted after completeAll to wipe everything:
  store.completeAll();      // mark all as completed
  store.clearCompleted();   // then delete all completed = delete everything
  res.status(200).json({ success: true, message: "All todos deleted." });
};

// ─── DELETE /completed — NEW ───────────────────────────────────────────────────

export const clearCompleted = (req, res) => {
  // This is what routes/todos.js imports! It was missing from your controller.
  const count = store.clearCompleted();
  res.status(200).json({
    success: true,
    message: `${count} completed todo(s) deleted.`,
    // Template literal: backticks + ${} to inject the variable.
  });
};