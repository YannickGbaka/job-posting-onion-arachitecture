class User {
  constructor(
    id = null,
    email,
    password = null,
    firstName = null,
    lastName = null,
    phoneNumber = null,
    userType,
    address,
    linkedin = null,
    companyName,
    companyIndustry,
    website = null
  ) {
    this.id = id;
    this.email = email;
    this.password = password; // Note: In a real application, never store plain text passwords
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.userType = userType;
    this.address = address;
    this.linkedin = linkedin;
    this.companyName = companyName;
    this.companyIndustry = companyIndustry;
    this.website = website;
  }
}

module.exports = { User };
