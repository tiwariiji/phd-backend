const express = require("express");
const router = express.Router();

const {
  createPersonalDetails,
  getPersonalDetails,
  createAcademicDetails,
  updateAcademicDetails,
  getAcademicDetails,
  createPhdPreferences,
  getPhdPreferences,
  updatePersonalDetails,
  createEntranceExamDetails,
  getEntranceExamDetails,
  updateEntranceExamDetails,
} = require("../../controllers/formController/formController.js");

// personal Details + contact Details
router.post("/personal-details", createPersonalDetails);
router.get("/get-personal-details", getPersonalDetails);
router.patch("/update-personal-details", updatePersonalDetails);

// phd preference
router.post("/phd-preferences", createPhdPreferences);
router.get("/phd-preferences", getPhdPreferences);

// academic details route
router.post("/academic-details", createAcademicDetails);
router.get("/get-academic-details", getAcademicDetails);
router.patch("/update-academic-details", updateAcademicDetails);

// entrance exam details
router.post("/exam-details", createEntranceExamDetails);
router.get("/get-exam-details", getEntranceExamDetails);
router.patch("/update-exam-details", updateEntranceExamDetails);

module.exports = router;
