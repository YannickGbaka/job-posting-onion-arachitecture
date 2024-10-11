const Todo = require("../../../domain/entities/Todo");

class TodoController {
  constructor(todoUseCases) {
    this.todoUseCases = todoUseCases;
  }

  async getAllTodos(req, res) {
    try {
      const todos = await this.todoUseCases.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTodoById(req, res) {
    try {
      const todo = await this.todoUseCases.getTodoById(req.params.id);
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTodo(req, res) {
    try {
      const { title } = req.body;
      const newTodo = new Todo(Date.now().toString(), title);
      const createdTodo = await this.todoUseCases.createTodo(newTodo);
      res.status(201).json(createdTodo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { title, completed } = req.body;
      const existingTodo = await this.todoUseCases.getTodoById(id);
      if (!existingTodo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      existingTodo.update(title);
      if (completed !== undefined) {
        completed ? existingTodo.complete() : existingTodo.uncomplete();
      }
      const updatedTodo = await this.todoUseCases.updateTodo(existingTodo);
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      await this.todoUseCases.deleteTodo(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TodoController;
