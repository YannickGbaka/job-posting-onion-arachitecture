class Todo {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  complete() {
    this.completed = true;
  }

  uncomplete() {
    this.completed = false;
  }

  update(title) {
    this.title = title;
  }
}

module.exports = Todo;
