const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

class AuthUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authenticateUser(email, password) {
    console.log(email, password);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      await bcrypt.hash(user.password, 10)
    );

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
}

module.exports = AuthUseCases;
