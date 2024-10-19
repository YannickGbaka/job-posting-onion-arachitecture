class GetAllResumesUseCase {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  async execute() {
    return this.resumeRepository.getAllResumes();
  }
}

module.exports = GetAllResumesUseCase;
