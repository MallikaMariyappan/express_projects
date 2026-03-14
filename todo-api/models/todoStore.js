// todoStore.js — CORRECTED (CommonJS → ES Modules)

import { v4 as uuidv4 } from 'uuid';
// Named import from uuid package.
// { v4 as uuidv4 } = "import the named export called v4, and call it uuidv4 locally"
// uuidv4() generates: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
// Every call returns a DIFFERENT random string — guaranteed unique.

let todos = [
  {
    id: uuidv4(),                           // unique ID generated at startup
    title: "Learn Express.js",
    description: "Understand routing, middleware, REST",
    completed: true,
    priority: "high",
    createdAt: new Date("2025-01-01T10:00:00Z"),
    updatedAt: new Date("2025-01-01T10:00:00Z"),
  },
  // ... more seed todos
];
// "let" not "const" — because clearCompleted and completeAll REPLACE the array.
// const would prevent reassignment and those functions would silently fail.

// ─── getAll ────────────────────────────────────────────────────────────────────

const getAll = (filter = {}) => {
  // filter = {} means: if no argument is passed, default to empty object.
  let result = [...todos];
  // Spread operator: creates a COPY of the todos array.
  // Why copy? So filtering doesn't mutate (change) the original array.

  if (filter.completed !== undefined) {
    // 🔴 YOUR BUG WAS HERE. Your original code did:
    //    const bool = filter.completed === "true";
    // But filter.completed is already a boolean (set in the controller).
    // That comparison would only work for strings. Fixed:
    result = result.filter((t) => t.completed === filter.completed);
    // .filter() returns a NEW array containing only items where the condition is true.
    // (t) => ... is an arrow function — t is each todo in the loop.
  }

  if (filter.priority) {
    result = result.filter((t) => t.priority === filter.priority);
  }

  return result;
};

// ─── getById ───────────────────────────────────────────────────────────────────

const getById = (id) => todos.find((t) => t.id === id) || null;
// .find() returns the FIRST item where the condition is true, or undefined.
// || null converts undefined → null (cleaner to check in the controller).

// ─── create ────────────────────────────────────────────────────────────────────

const create = ({ title, description = "", priority = "medium" }) => {
  // Destructuring with defaults:
  // If description is not passed → ""
  // If priority is not passed    → "medium"
  const todo = {
    id: uuidv4(),
    title,           // shorthand for title: title
    description,
    completed: false, // always starts as false — a new todo is never done yet
    priority,
    createdAt: new Date(),   // current date/time
    updatedAt: new Date(),
  };
  todos.push(todo);  // add to the end of the array
  return todo;       // return it so the controller can send it back to the client
};

// ─── update ────────────────────────────────────────────────────────────────────

const update = (id, fields) => {
  const index = todos.findIndex((t) => t.id === id);
  // findIndex returns the POSITION (0, 1, 2...) or -1 if not found.
  if (index === -1) return null;  // signal "not found" to the controller

  todos[index] = {
    ...todos[index],  // copy ALL existing fields first
    ...fields,        // then overwrite only what was passed in
    id,               // lock id — never let it be overwritten
    updatedAt: new Date(),  // always stamp the update time
  };
  // Note: we deliberately do NOT lock createdAt here because it's not in fields anyway.
  return todos[index];
};

// ─── remove ────────────────────────────────────────────────────────────────────

const remove = (id) => {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const [deleted] = todos.splice(index, 1);
  // splice(index, 1) removes 1 item at that position and returns [removedItem].
  // const [deleted] = ... destructures that array to get just the item.
  return deleted;  // controller sends this back so client knows what was deleted
};

// ─── completeAll ───────────────────────────────────────────────────────────────

const completeAll = () => {
  todos = todos.map((t) => ({ ...t, completed: true, updatedAt: new Date() }));
  // .map() returns a NEW array — every item transformed.
  // Spreading ...t copies all fields, then we overwrite completed and updatedAt.
  // We reassign todos = because map returns a new array, not mutating in place.
  return todos;
};

// ─── clearCompleted ────────────────────────────────────────────────────────────

const clearCompleted = () => {
  const before = todos.length;          // count before deletion
  todos = todos.filter((t) => !t.completed);
  // filter keeps items where condition is true.
  // !t.completed = keep todos that are NOT completed (i.e. delete the completed ones).
  return before - todos.length;         // return how many were deleted
};

// ─── export ────────────────────────────────────────────────────────────────────

export { getAll, getById, create, update, remove, completeAll, clearCompleted };
// Named exports — no "default". Other files import with: import { getAll } from '...'
// This replaces CommonJS: module.exports = { getAll, ... }