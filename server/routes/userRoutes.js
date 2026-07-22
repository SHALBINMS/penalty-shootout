const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { registerUser, loginUser } = require("../controllers/userController");
const asyncHandler = require("../middleware/asyncHandler");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../middleware/validateRequest");
const rateLimit = require("express-rate-limit");

// Limit credential attempts without affecting the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again in 15 minutes." },
});

router.post("/register", authLimiter, validate(registerSchema), registerUser);

router.post("/login", authLimiter, validate(loginSchema), loginUser);

router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  }),
);

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
