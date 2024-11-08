const { MongoClient, ObjectId } = require("mongodb");
const { User } = require("../../domain/entities/User");

class MongoUserRepository {
  constructor(url, dbName, collectionName) {
    this.url = url;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = null;
    this.collection = null;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url);
    const db = this.client.db(this.dbName);
    this.collection = db.collection(this.collectionName);
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
    }
  }

  async create(user) {
    const result = await this.collection.insertOne(user);
    return { ...user, id: result.insertedId.toString() };
  }

  async findByEmail(email) {
    const user = await this.collection.findOne({ email });
    return user
      ? new User(
          user._id.toString(),
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.phoneNumber,
          user.userType,
          user.address,
          user.linkedin,
          user.companyName,
          user.companyIndustry,
          user.website
        )
      : null;
  }

  async findById(id) {
    const user = await this.collection.findOne({ _id: new ObjectId(id) });
    return user ? { ...user } : null;
  }

  async findAll() {
    const users = await this.collection.find().toArray();
    return users.map((user) => ({ ...user }));
  }

  async update(user) {
    const { id, ...updateData } = user;
    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return this.findById(id);
  }

  async delete(id) {
    await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = MongoUserRepository;
