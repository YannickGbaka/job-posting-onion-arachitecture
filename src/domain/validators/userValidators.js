function validateEmail(email) {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // Example: Password must be at least 8 characters long
  return password.length >= 8;
}

module.exports = {
  validateEmail,
  validatePassword,
};
