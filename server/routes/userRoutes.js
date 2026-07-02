const express = require("express");

const router = express.Router();

const User = require("../models/user");

const protect = require("../middleware/authMiddleware");

const admin = require("../middleware/adminMiddleware");

const upload = require("../middleware/uploadMiddleware");

const { registerUser,loginUser } = require("../controllers/userController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json(user);
});

router.get("/admin", protect, admin, (req, res) => {
  res.json({
    message: "Welcome Admin",
  });
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded",
    file: req.file,
  });
});

module.exports = router;
