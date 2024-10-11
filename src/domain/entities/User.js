class User {
  constructor(
    id,
    email,
    password,
    firstName = null,
    lastName = null,
    userType,
    address,
    companyName,
    companyIndustry,
    website = null
  ) {
    this.id = id;
    this.email = email;
    this.password = password; // Note: In a real application, never store plain text passwords
    this.firstName = firstName;
    this.lastName = lastName;
    this.userType = userType;
    this.address = address;
    this.companyName = companyName;
    this.companyIndustry = companyIndustry;
    this.website = website;
  }
}

module.exports = { User };
