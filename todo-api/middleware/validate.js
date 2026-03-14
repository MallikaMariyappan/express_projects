// validate.js — Request validation middleware

const VALID_PRIORITIES = ["low", "medium", "high"];

/**
 * Validates the body when CREATING a todo.
 * Required: title
 * Optional: description, priority (low | medium | high)
 */
const validateCreate = (req, res, next) => {
  const { title, description, priority } = req.body;
  const errors = [];

  // title — required, non-empty string
  if (!title) {
    errors.push("'title' is required.");
  } else if (typeof title !== "string" || title.trim().length === 0) {
    errors.push("'title' must be a non-empty string.");
  } else if (title.trim().length > 100) {
    errors.push("'title' must be 100 characters or fewer.");
  }

  // description — optional, but must be a string if provided
  if (description !== undefined && typeof description !== "string") {
    errors.push("'description' must be a string.");
  }

  // priority — optional, but must be one of the allowed values if provided
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`'priority' must be one of: ${VALID_PRIORITIES.join(", ")}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Sanitise: trim whitespace before it reaches the controller
  req.body.title = title.trim();
  if (description) req.body.description = description.trim();

  next();
};

/**
 * Validates the body when UPDATING a todo.
 * At least one field must be provided.
 * All fields are optional individually.
 */
const validateUpdate = (req, res, next) => {
  const { title, description, completed, priority } = req.body;
  const errors = [];
  const allowedKeys = ["title", "description", "completed", "priority"];

  // Reject completely empty bodies
  const receivedKeys = Object.keys(req.body).filter((k) => allowedKeys.includes(k));
  if (receivedKeys.length === 0) {
    return res.status(400).json({
      success: false,
      errors: [`At least one of these fields is required: ${allowedKeys.join(", ")}.`],
    });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.push("'title' must be a non-empty string.");
    } else if (title.trim().length > 100) {
      errors.push("'title' must be 100 characters or fewer.");
    }
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("'description' must be a string.");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("'completed' must be a boolean (true or false).");
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`'priority' must be one of: ${VALID_PRIORITIES.join(", ")}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  if (title) req.body.title = title.trim();
  if (description) req.body.description = description.trim();

  next();
};

module.exports = { validateCreate, validateUpdate };