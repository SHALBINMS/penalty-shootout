const User = require("../models/User");

const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403);

      return next(new Error("Admin access only"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = admin;
