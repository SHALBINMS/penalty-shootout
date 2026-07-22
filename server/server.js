require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const errorHandler = require("./middleware/errorMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

const configuredOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    "http://localhost:5173",
    "https://localhost:5173",
    "https://penalty-shootout-5bhbkg0u4-shalbinms88-8113s-projects.vercel.app",
    "https://penalty-shootout-git-main-shalbinms88-8113s-projects.vercel.app",
  ]),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      console.warn("Blocked CORS request from:", origin);
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static("uploads"));

app.use("/students", studentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/scores", scoreRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "MONGO_URI is not defined. Set the env variable before starting the app.",
  );
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({
    message: "Backend API Running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
