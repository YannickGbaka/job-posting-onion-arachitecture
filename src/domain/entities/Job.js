class Job {
  constructor(id, title, description, salary, location, requirements, jobType) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.salary = salary;
    this.location = location;
    this.requirements = requirements;
    this.jobType = jobType;
  }
}

module.exports = Job;
