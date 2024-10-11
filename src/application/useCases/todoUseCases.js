class TodoUseCases {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  async getAllTodos() {
    return this.todoRepository.findAll();
  }

  async getTodoById(id) {
    return this.todoRepository.findById(id);
  }

  async createTodo(todo) {
    return this.todoRepository.create(todo);
  }

  async updateTodo(todo) {
    return this.todoRepository.update(todo);
  }

  async deleteTodo(id) {
    return this.todoRepository.delete(id);
  }
}

module.exports = TodoUseCases;
