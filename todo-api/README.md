# Todo API

This is a simple Express.js application for managing todos, created as part of my learning journey in Node.js and Express. It's designed to help me understand the basics of building RESTful APIs with Express, including routing, middleware, and basic CRUD operations.

## Features

- Create new todos
- Retrieve all todos or a specific todo by ID
- Update existing todos
- Delete todos
- Basic validation middleware

## Installation

1. Navigate to the `todo-api` directory:
   ```
   cd todo-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the server in development mode:
```
npm run dev
```

Or in production mode:
```
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Project Structure

- `server.js` - Main server file
- `controllers/Todocontroller.js` - Controller for todo operations
- `middleware/validate.js` - Validation middleware
- `models/todoStore.js` - In-memory data store for todos
- `routes/todos.js` - Route definitions

## Technologies Used

- Node.js
- Express.js
- JavaScript (ES6+)

This project is for educational purposes and demonstrates fundamental concepts in backend development.