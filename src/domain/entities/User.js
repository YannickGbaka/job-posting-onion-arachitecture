class User {
  constructor(
    email,
    password = null,
    firstName = null,
    lastName = null,
    phoneNumber = null,
    userType,
    address = null,
    linkedin = null,
    companyName = null,
    companyIndustry = null,
    website = null,
    id = null
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
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
