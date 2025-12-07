const admissionModel = require("../models/admissionModel");
const cloudinary = require("../config/cloudinary.js");

// Create or return existing draft
exports.createAdmission = async (req, res) => {
  try {
    const userId = req.user.id;

    // If draft already exists → return it
    let admission = await admissionModel.findOne({ userId });

    if (admission) {
      return res.status(200).json({
        message: "Existing draft returned",
        admission,
      });
    }

    // Else create new draft
    admission = await admissionModel.create({
      userId,
      applicationStatus: "Draft",
      payment: { status: "Pending" },
    });

    return res.status(201).json({
      message: "Draft created",
      admission,
    });
  } catch (err) {
    console.error("Create Admission Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.updateAdmission = async (req, res) => {
  try {
    const id = req.params.id;
    let admission = await admissionModel.findById(id);

    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);
    console.log("REQ PARAM ID:", req.params.id);

    if (!admission) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (admission.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (admission.applicationStatus !== "Draft") {
      return res
        .status(400)
        .json({ message: "Cannot modify after submission" });
    }

    // Handle FILE uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "phd_application_docs", resource_type: "auto" },
              (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              }
            )
            .end(file.buffer);
        });

        if (!admission.documents) admission.documents = {};
        admission.documents.set(file.fieldname, uploaded);
      }
    }

    // Handle JSON updates - check if data is in req.body.data (FormData) or directly in req.body
    let incoming;

    if (req.body.data) {
      // Data sent via FormData (when files are uploaded)
      try {
        incoming = JSON.parse(req.body.data);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        return res.status(400).json({
          error: "Invalid JSON in data field",
          details: parseError.message,
        });
      }
    } else if (Object.keys(req.body).length > 0) {
      // Direct JSON body (when no files)
      incoming = req.body;
    }

    if (incoming) {
      // ✅ FIXED: Properly merge nested objects
      if (incoming.personal) {
        admission.personal = { ...admission.personal, ...incoming.personal };
      }

      if (incoming.contact) {
        admission.contact = {
          permanentAddress: {
            ...admission.contact?.permanentAddress,
            ...incoming.contact.permanentAddress,
          },
          correspondenceAddress: {
            ...admission.contact?.correspondenceAddress,
            ...incoming.contact.correspondenceAddress,
          },
          phone: incoming.contact.phone || admission.contact?.phone,
          alternatePhone:
            incoming.contact.alternatePhone ||
            admission.contact?.alternatePhone,
          email: incoming.contact.email || admission.contact?.email,
        };
      }

      if (incoming.education) {
        admission.education = {
          class10: {
            ...admission.education?.class10,
            ...incoming.education.class10,
          },
          class12: {
            ...admission.education?.class12,
            ...incoming.education.class12,
          },
          bachelors: {
            ...admission.education?.bachelors,
            ...incoming.education.bachelors,
          },
          masters: {
            ...admission.education?.masters,
            ...incoming.education.masters,
          },
          mphil: { ...admission.education?.mphil, ...incoming.education.mphil },
        };
      }

      if (incoming.entranceExams) {
        admission.entranceExams = {
          ugcNet: {
            ...admission.entranceExams?.ugcNet,
            ...incoming.entranceExams.ugcNet,
          },
          gate: {
            ...admission.entranceExams?.gate,
            ...incoming.entranceExams.gate,
          },
          universityExam: {
            ...admission.entranceExams?.universityExam,
            ...incoming.entranceExams.universityExam,
          },
        };
      }

      if (incoming.employment) {
        admission.employment = {
          ...admission.employment,
          ...incoming.employment,
        };
      }

      if (incoming.research) {
        admission.research = {
          area: incoming.research.area || admission.research?.area,
          proposalTitle:
            incoming.research.proposalTitle ||
            admission.research?.proposalTitle,
          sop: incoming.research.sop || admission.research?.sop,
          preferredSupervisor: {
            ...admission.research?.preferredSupervisor,
            ...incoming.research.preferredSupervisor,
          },
        };
      }

      if (incoming.publications) {
        admission.publications = incoming.publications;
      }
    }

    admission.updatedAt = new Date();
    await admission.save();

    return res.json({
      message: "Draft updated successfully",
      admission,
    });
  } catch (err) {
    console.error("Update Admission Error:", err);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
};

// Final Submit (after payment)
exports.submitAdmission = async (req, res) => {
  try {
    const id = req.params.id;
    const admission = await admissionModel.findById(id);

    if (!admission) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (admission.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (admission.applicationStatus !== "Draft") {
      return res.status(400).json({
        message: "Application already submitted",
      });
    }

    // Lock application
    admission.applicationStatus = "Submitted";
    admission.submittedAt = new Date();

    await admission.save();

    return res.json({
      message: "Application submitted successfully",
      admission,
    });
  } catch (err) {
    console.error("Submit Admission Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get logged user's draft/application
exports.getMyAdmission = async (req, res) => {
  try {
    const admission = await admissionModel.findOne({ userId: req.user.id });
    if (!admission) {
      return res.status(404).json({ message: "No application found" });
    }
    return res.json(admission);
  } catch (err) {
    console.error("Get My Admission Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Get specific application by ID (For Student View)
exports.getAdmissionById = async (req, res) => {
  try {
    const admission = await admissionModel.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ message: "Not found" });
    }

    if (admission.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.json(admission);
  } catch (err) {
    console.error("Get Admission Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

// Delete draft — allowed only before submission
exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await admissionModel.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (admission.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (admission.applicationStatus !== "Draft") {
      return res.status(400).json({
        message: "You can only delete draft applications",
      });
    }

    await admission.deleteOne();
    return res.json({ message: "Draft deleted successfully" });
  } catch (err) {
    console.error("Delete Draft Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

/* --- ADMIN API --- */

exports.adminGetAllAdmissions = async (req, res) => {
  try {
    const admissions = await admissionModel
      .find()
      .populate("userId", "name email");
    return res.json(admissions);
  } catch (err) {
    console.error("Admin Get List Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.adminUpdateStatus = async (req, res) => {
  try {
    const { applicationStatus } = req.body;

    const admission = await admissionModel.findByIdAndUpdate(
      req.params.id,
      { applicationStatus },
      { new: true }
    );

    return res.json({
      message: "Status updated",
      admission,
    });
  } catch (err) {
    console.error("Admin Status Update Error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
};
