const Application = require('../../domain/entities/Application')

class ApplicationUseCases {
  constructor(applicationRepository, userRepository, jobRepository) {
    this.applicationRepository = applicationRepository;
    this.userRepository = userRepository;
    this.jobRepository = jobRepository;
  }

  async createApplication(applicationData) {
    const user = await this.userRepository.findById(applicationData.userId);
    if (!user) {
      throw new Error("User not found");  
    }

    const job = await this.jobRepository.findById(applicationData.jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const application = new Application(applicationData);
    return this.applicationRepository.create(application);
  }

  async getUserApplications(userId) {
    return this.applicationRepository.findByUserId(userId);
  }

  async updateApplicationStatus(id, newStatus) {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error("Application not found");
    }

    application.updateStatus(newStatus);
    return this.applicationRepository.update(id, application);
  }

  async getAllApplications() {
    return this.applicationRepository.findAll();
  }

  async deleteApplication(applicationId) {
    if (!applicationId) {
        throw new Error('Application ID is required');
    }
    
    await this.applicationRepository.delete(applicationId);
    return true;
  }
}

module.exports = ApplicationUseCases;
