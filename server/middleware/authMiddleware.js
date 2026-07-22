const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);

    return next(new Error("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  if (!token || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Invalid authorization header"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401);

    next(new Error("Invalid token"));
  }
};

module.exports = protect;
