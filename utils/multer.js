const multer = require("multer");

// Change to memoryStorage for Cloudinary upload_stream
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
