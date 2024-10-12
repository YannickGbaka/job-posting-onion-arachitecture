class JobUseCases {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  async createJob(jobData) {
    const newJob = await this.jobRepository.create(jobData);
    return newJob;
  }

  async getJobById(id) {
    return this.jobRepository.findById(id);
  }

  async getAllJobs() {
    return this.jobRepository.findAll();
  }

  async updateJob(id, jobData) {
    return this.jobRepository.update(id, jobData);
  }

  async deleteJob(id) {
    return this.jobRepository.delete(id);
  }
}

module.exports = JobUseCases;
