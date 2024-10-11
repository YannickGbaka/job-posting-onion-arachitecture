const UserRepository = require("../../domain/repositories/userRepository");

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
    this.nextId = 1; // Add this line to keep track of IDs
  }

  async create(user) {
    const id = this.nextId++; // Generate a new ID
    const userCopy = { ...user, id }; // Add the ID to the user object
    this.users.set(id, userCopy); // Use the ID as the key
    return userCopy;
  }

  async findById(id) {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  async findByEmail(email) {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async findAll() {
    return Array.from(this.users.values());
  }

  async update(user) {
    if (!this.users.has(user.id)) {
      return null;
    }
    this.users.set(user.id, { ...user });
    return { ...user };
  }

  async delete(id) {
    return this.users.delete(id);
  }
}

module.exports = InMemoryUserRepository;
