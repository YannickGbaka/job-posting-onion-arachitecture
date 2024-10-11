const TodoRepository = require("../../domain/repositories/TodoRepository");

class InMemoryTodoRepository extends TodoRepository {
  constructor() {
    super();
    this.todos = new Map();
  }

  async findAll() {
    return Array.from(this.todos.values());
  }

  async findById(id) {
    return this.todos.get(id);
  }

  async create(todo) {
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(todo) {
    if (!this.todos.has(todo.id)) {
      throw new Error("Todo not found");
    }
    this.todos.set(todo.id, todo);
    return todo;
  }

  async delete(id) {
    if (!this.todos.has(id)) {
      throw new Error("Todo not found");
    }
    this.todos.delete(id);
  }
}

module.exports = InMemoryTodoRepository;
