const multer = require("multer");
const path = require("path");
const ResumeMatchingService = require("../../../domain/services/ResumeMatchingService");

class ApplicationController {
  constructor(applicationUseCases, userUseCases, jobUseCase) {
    this.applicationUseCases = applicationUseCases;
    this.upload = this.configureMulter();
    this.userUseCases = userUseCases;
    this.jobUseCases = jobUseCase;
  }

  configureMulter() {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "src/public/resumes");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    });

    return multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const allowedTypes = [".pdf", ".doc", ".docx"];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              "Invalid file type. Only PDF and Word documents are allowed."
            )
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    });
  }

  async createApplication(req, res) {
    try {
      this.upload.single("resumeFile")(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const { jobId, coverLetter, ...userData } = req.body;
        const resumeFile = req.file ? req.file.filename : null;

        if (
          !userData.email ||
          !jobId ||
          !userData.firstName ||
          !userData.lastName ||
          !userData.phoneNumber ||
          !userData.address
        ) {
          return res.status(400).json({
            error: "Missing required fields",
            required: [
              "email",
              "jobId",
              "firstName",
              "lastName",
              "phoneNumber",
              "address",
            ],
          });
        }

        // First, try to find or create the user
        let user;
        try {
          user = await this.userUseCases.findOrCreateUser(userData);
        } catch (error) {
          return res.status(400).json({
            error: "Error processing user data",
            details: error.message,
          });
        }

        const job = await this.jobUseCases.getJobById(jobId);
        const { score } = ResumeMatchingService.isJobOfferMatch(
          "\n\nGosse Yannick Cyriaque GBAKA\nćgosseyannick553@gmail.com|Ħ(+225) 01 41 92 94 51 | 05 44 07 41 57\na\nhttps://github.com/YannickGbaka|\n]\nhttps://www.linkedin.com/in/gosseycg/\n\nAbidjan, Côte d’Ivoire\nTechnical Skills\nLanguages:PHP, Python, JavaScript, SQL, Dart, HTML / CSS\nDatabases:MySQL, SQLite, PostgreSQL\nFrameworks:Laravel, Livewire, PHPUnit, Flutter, Alpine JS, Bootstrap\nCloud - DevOps - DevSecOps:Docker, GIT, SonarQube, AWS, Dependency TracK, GitHub Actions\nParadigms:Agile, Scrum, Design Patterns, SOLID Principles, Microservices, REST APIs\nTools:Github, Postman, Visual Studio Code, Notion, MySQLWorkbench, Slack\nProfessional Experience\nYouth Employment Agency, Riviera BonouminJan. 2023 - Present\nFullstack Developer\n•Optimized data entry, tracking, and processing of job seeker complaints with a complaint management application,\nwhile integrating a user satisfaction feedback system.\n•Streamlined profile search among nearly a million job seekers in the database, for offers managed by the Youth Em-\nployment Agency, through a user-friendly and intuitive platform. This platform also enables efficient data and CV\nextraction.\n•Revamped the user interface and deployed the mobile application for the Youth Employment Agency, now used by\nover 13,000 beneficiaries to access its services.\nTechnologies and Tools: PHP | Laravel | PHPUnit | Bootstrap | Alpine JS | JavaScript | MySQL | Flutter, CentOS | Git &\nGithub actions | MySQL\nFX_LABS SARL, Riviera 2May 2021 - Dec. 2022\nWeb Developer\n•Ensured maintenance, addition, and enhancement of features for the Quorum Enligne project, a web application ded-\nicated to managing general meetings of companies listed on the BRVM.\n•Automated the analysis and processing of shareholder lists with more than 10,000 lines.\n•Designed and developed a web application for simulating gross salary, comparing salaries among users with similar\nprofiles to detect cases of underpayment.\nTechnologies & Tools: Python | Pandas | Anaconda | PHP | Laravel | Bootstrap | Alpine JS | JavaScript | MySQL | Ubuntu\n| Bitbucket\nEducation\nCEFIVE (CENTER FOR COMPUTER TRAINING AND VISUAL TEACHING STUDIES)Feb. 2024 - Present\nComputer Design Engineering\n(UPB) Bingerville Polytechnic UniversityDec. 2018 - June 2021\nBachelor’s in Applied Computer Methods for Business ManagementWith Honors\nRelevant Courses: Object-Oriented Programming, Web & Mobile Development, Applied Math, Advanced Algorithms and\nData Structures, Operating Systems, Computer Networks, Scripting (Shell & Python)\nSimone Ehivet Municipal High School, Yopougon NiangonJuly 2018\nHigh School Diploma, Science TrackWith Passable Mention\nSoft Skills\nProblem Solving • Teamwork • Analytical • Communication • Creativity • Open-mindedness • Independence • Curiosity •\nObjectivity •\n\nAwards and Certifications\n•First Prize for Best English Speaker:national public speaking competition called theFLAMME LINGUISTIQUE\nINP-HB2021 edition.\n•First Prize ”Genie UPB” 2019:annual hackathon organized by Bingerville Polytechnic University.\n•DevOps Training: Africa Project Management | Feb. 2024\n•B2 English Certificate: EFSET | March 2022\nLanguages\n•French\n•English (Bilingual)",
          `${job.description} - ${job.requirements}`
        );

        const application = await this.applicationUseCases.createApplication({
          userId: user.id, // Use the user ID from the found/created user
          jobId,
          resumeFile,
          score,
          coverLetter,
        });

        res.status(201).json(application);
      });
    } catch (error) {
      console.error("Error in createApplication:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getApplicationById(req, res) {
    const { id } = req.params;
    const application = await this.applicationUseCases.getApplicationById(id);
    res.status(200).json(application);
  }

  //   async getUserApplications(req, res) {
  //     try {
  //       const { userId } = req.params;
  //       const applications = await this.applicationUseCases.getUserApplications(
  //         userId
  //       );
  //       res.status(200).json(applications);
  //     } catch (error) {
  //       res.status(400).json({ error: error.message });
  //     }
  //   }

  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedApplication =
        await this.applicationUseCases.updateApplicationStatus(id, status);
      res.status(200).json(updatedApplication);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateApplication(req, res) {
    const { id } = req.params;
    const applicationData = req.body;
    const updatedApplication = await this.applicationUseCases.updateApplication(
      id,
      applicationData
    );
    res.status(200).json(updatedApplication);
  }

  async deleteApplication(req, res) {
    try {
      const { id } = req.params;
      await this.applicationUseCases.deleteApplication(id);
      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllApplications(req, res) {
    try {
      const applications = await this.applicationUseCases.getAllApplications();
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ApplicationController;
