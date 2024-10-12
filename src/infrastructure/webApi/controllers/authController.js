class AuthController {
  constructor(authUseCases) {
    this.authUseCases = authUseCases;
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.authUseCases.authenticateUser(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
