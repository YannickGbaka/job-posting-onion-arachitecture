class Job {
  constructor(
    id,
    title,
    description,
    salary,
    location,
    requirements,
    jobType,
    applicationDeadline
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.salary = salary;
    this.location = location;
    this.requirements = requirements;
    this.jobType = jobType;
    this.applicationDeadline = applicationDeadline;
  }
}

module.exports = Job;
