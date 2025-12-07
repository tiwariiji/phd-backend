const {
  personalDetailsValidator,
  updatePersonalDetailsValidator,
} = require("../../validation/formDetails/personalDetailsValidator");
const personalDetailsModel = require("../../models/formDetailModel/personalDetailsModel");

// phd preference
const phdPreferencesModel = require("../../models/formDetailModel/phdPreferenceModel");
const phdPreferencesValidator = require("../../validation/formDetails/phdPreferenceValidator");

// academic detail model and validator
const AcademicDetails = require("../../models/formDetailModel/academicDetailsModel.js");
const {
  academicDetailsUpdateValidation,
  academicDetailsCreateValidation,
} = require("../../validation/formDetails/academicDetailsValidator.js");

// entrance exam model and validator
const EntranceExamDetailsModel = require("../../models/formDetailModel/entraceExamModel");
const {
  entranceExamCreateValidation,
  entranceExamUpdateValidation,
} = require("../../validation/formDetails/entraceExamValidator");

// personal + contact details
module.exports.createPersonalDetails = async (req, res) => {
  try {
    // VALIDATE INPUT DATA
    const { error } = personalDetailsValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const userId = req.user._id;

    // CHECK IF USER HAS ALREADY SUBMITTED
    const existing = await personalDetailsModel.exists({ userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Details already submitted",
      });
    }

    // save data
    const personalDetails = await personalDetailsModel.create({
      userId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Details saved successfully",
      data: personalDetails,
    });
  } catch (err) {
    console.error("PERSONAL DETAILS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports.getPersonalDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch personal details of logged-in user
    const details = await personalDetailsModel.findOne({ userId });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Personal details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Personal details fetched successfully",
      data: details,
    });
  } catch (err) {
    console.error("GET PERSONAL DETAILS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports.updatePersonalDetails = async (req, res) => {
  try {
    // validate
    const { error } = updatePersonalDetailsValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const userId = req.user._id;

    // check if personal details exists
    const personalDetails = await personalDetailsModel.findOne({ userId });

    if (!personalDetails) {
      return res.status(400).json({
        success: false,
        message: "personal details not found",
      });
    }

    // update provided fields
    Object.assign(personalDetails, req.body);

    await personalDetails.save();

    return res.status(200).json({
      success: true,
      message: "Details updated successfully",
    });
  } catch (err) {
    console.error("UPDATE PERSONAL DETAILS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// phd preference details
module.exports.createPhdPreferences = async (req, res) => {
  try {
    // Validate incoming data
    const { error } = phdPreferencesValidator.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const userId = req.user._id;

    // Check if preferences are already submitted
    const existing = await phdPreferencesModel.exists({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "PhD preferences already submitted",
      });
    }

    // Normalize & clean data
    let { programType, faculties } = req.body;

    programType = programType.map((p) => p.trim().toLowerCase());

    faculties = faculties.map((f) => ({
      facultyName: f.facultyName.trim(),
      departments: f.departments.map((d) => d.trim()),
    }));

    // Create and save the preferences
    const preferences = await phdPreferencesModel.create({
      userId,
      programType,
      faculties,
    });

    return res.status(201).json({
      success: true,
      message: "PhD preferences saved successfully",
      data: preferences,
    });
  } catch (err) {
    console.error("SAVE PHD PREFERENCES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports.getPhdPreferences = async (req, res) => {
  try {
    const userId = req.user._id;

    const preferences = await phdPreferencesModel.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "No PhD preferences found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "PhD preferences fetched successfully",
      data: preferences,
    });
  } catch (err) {
    console.error("GET PHD PREFERENCES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//academic details
module.exports.createAcademicDetails = async (req, res) => {
  try {
    const { error } = academicDetailsCreateValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }
    const userId = req.user._id;

    // Check if record already exists
    const existingRecord = await AcademicDetails.exists({ userId });
    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message: "Academic details already submitted. You can only update.",
      });
    }

    // Create academic details
    const academicDetails = await AcademicDetails.create({
      userId,
      ...req.body,
      filled: true,
    });

    return res.status(201).json({
      success: true,
      message: "Academic details saved successfully",
      data: academicDetails,
    });
  } catch (err) {
    console.error("CREATE ACADEMIC DETAILS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports.getAcademicDetails = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const details = await AcademicDetails.findOne({ userId });

    return res.status(200).json({
      message: details
        ? "Academic details fetched successfully"
        : "No academic details found",
      academicDetails: details,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
module.exports.updateAcademicDetails = async (req, res) => {
  try {
    // validation
    const { error } = academicDetailsUpdateValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing!" });
    }

    // Check if user has existing academic details
    const existing = await AcademicDetails.findOne({ userId });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "No academic details found! Please submit first.",
      });
    }

    //Convert nested objects into dot notation for safe updates
    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (
          obj[key] &&
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key])
        ) {
          flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
      return result;
    };

    const updateData = flattenObject(req.body);

    // Add updatedAt
    updateData.updatedAt = new Date();

    // Update document
    const updated = await AcademicDetails.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Academic details updated successfully",
      academicDetails: updated,
    });
  } catch (err) {
    console.error("Update Academic ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// entrance exam details
module.exports.createEntranceExamDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing!",
      });
    }
    //validation
    const { error } = entranceExamCreateValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }
    //check if user already submitted form
    const exists = await EntranceExamDetailsModel.findOne({ userId });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Entrance exam details already submitted!",
      });
    }
    //save exam details
    const entranceExamDetails = await EntranceExamDetailsModel.create({
      userId,
      ...req.body,
      filled: true,
    });

    return res.status(201).json({
      success: true,
      message: "Entrance exam details saved successfully",
      data: entranceExamDetails,
    });
  } catch (err) {
    console.error("CREATE ENTRANCE EXAM ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
module.exports.getEntranceExamDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing!",
      });
    }

    // fetch detail using userId
    const details = await EntranceExamDetailsModel.findOne({ userId });

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Entrance exam details not found! Please submit first.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entrance exam details fetched successfully",
      data: details,
    });
  } catch (err) {
    console.error("GET ENTRANCE EXAM ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports.updateEntranceExamDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing!",
      });
    }

    //validation
    const { error } = entranceExamUpdateValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((e) => e.message),
      });
    }

    //check existing exam detail model
    const existing = await EntranceExamDetailsModel.findOne({ userId });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Entrance exam details not found! Please submit first.",
      });
    }

    //FLATTEN NESTED OBJECTS FOR SAFE UPDATE
    const flattenObject = (obj, parentKey = "", result = {}) => {
      for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;

        if (
          obj[key] &&
          typeof obj[key] === "object" &&
          !Array.isArray(obj[key])
        ) {
          flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
      return result;
    };

    const updateData = flattenObject(req.body);
    updateData.updatedAt = new Date();

    //update database
    const updated = await EntranceExamDetailsModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Entrance exam details updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("UPDATE ENTRANCE EXAM ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
