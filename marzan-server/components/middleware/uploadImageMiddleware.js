const multer = require("multer");

// memoryStorage (not diskStorage): the file is held in req.file.buffer only long enough to
// stream it to Cloudinary, so nothing is ever written to this server's disk.
const storage = multer.memoryStorage();

// A product photo only needs to be a JPEG, PNG, or WebP, and 5 MB is already generous for
// a web-sized product image (anything larger is almost certainly an uncompressed export).
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, or WebP image files are allowed."));
    }
  },
});

module.exports = upload;
