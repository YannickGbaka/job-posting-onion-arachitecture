class FindMatchingResumesUseCase {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  async execute(jobOffer) {
    return this.resumeRepository.findMatchingResumes(jobOffer);
  }
}

module.exports = FindMatchingResumesUseCase;
