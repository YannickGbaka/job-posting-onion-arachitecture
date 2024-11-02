const { User } = require("../../domain/entities/User");
const {
  validateEmail,
  validatePassword,
} = require("../../domain/validators/userValidators");

class UserUseCases {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(userData) {
    console.log(userData)
    const { email, password, confirmPassword, userType } = userData;

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (password) {
      if (!validatePassword(password)) {
        throw new Error("Password does not meet requirements");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    let newUser;

    switch (userType) {
      case "Company":
        const { companyName, industry } = userData;
        if (!companyName || !industry) {
          throw new Error(
            "Company name and industry are required for company registration"
          );
        }
        newUser = new User(
          email,
          password,
          userData.firstName || null,
          userData.lastName  || null,
          userData.phoneNumber || null,
          userType,
          userData.address || null ,
          userData.linkedin || null,
          companyName,
          companyIndustry,
          userData.website || null
        );
        console.log(newUser)
        break;
      case "User":
        newUser = new User(
          email,
          userData.password || password,
          userData.firstName || null,
          userData.lastName  || null,
          userData.phoneNumber || null,
          userType,
          userData.address || null ,
          userData.linkedin || null,
          userData.companyName || null, 
          userData.companyIndustry || null,
          userData.website || null
        );
        console.log("new" + newUser)
        break;
      case "Admin":
        throw new Error(
          "Admin users cannot be created through regular registration"
        );
      default:
        throw new Error("Invalid user type");
    }

    // Save the new user
    const savedUser = await this.userRepository.create(newUser);
    return savedUser;
  }

  async getAllUsers() {
    try {
      if (!this.userRepository) {
        throw new Error("User repository is not initialized");
      }
      if (typeof this.userRepository.findAll !== "function") {
        throw new Error(
          "findAll method is not implemented in the user repository"
        );
      }
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching all users: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching all users: ${error.message}`);
    }
  }

  async updateUser(id, userData) {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }

      // Update user properties
      Object.assign(existingUser, userData);

      // Validate email if it's being updated
      if (userData.email && !validateEmail(userData.email)) {
        throw new Error("Invalid email format");
      }

      // Validate password if it's being updated
      if (userData.password) {
        if (!validatePassword(userData.password)) {
          throw new Error("Password does not meet requirements");
        }
        existingUser.password = userData.password; // In a real app, you'd hash this password
      }

      return await this.userRepository.update(existingUser);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error("User not found");
      }
      await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async findOrCreateUser(userData) {
    try {
      let user = await this.userRepository.findByEmail(userData.email);
      if (!user) {  
        user = await this.registerUser({'userType': 'User', ...userData});
      }
      console.log(user)
      return user;
    } catch (error) {
      throw new Error(`Error in findOrCreateUser: ${error.message}`);
    }
  }
}

module.exports = {
  UserUseCases,
};
