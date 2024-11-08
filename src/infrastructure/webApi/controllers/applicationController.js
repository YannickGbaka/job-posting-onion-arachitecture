const multer = require("multer");
const path = require("path");

class ApplicationController {
  constructor(applicationUseCases, userUseCases) {
    this.applicationUseCases = applicationUseCases;
    this.upload = this.configureMulter();
    this.userUseCases = userUseCases;
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
        console.log(user.id);
        const application = await this.applicationUseCases.createApplication({
          userId: user.id, // Use the user ID from the found/created user
          jobId,
          resumeFile,
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
