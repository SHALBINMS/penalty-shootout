const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = file.originalname.toLowerCase().match(/\.(jpe?g|png)$/);
  if (extension && ["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPG and PNG images are allowed");
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

module.exports = upload;
