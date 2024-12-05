require("dotenv").config(); // 환경 변수 로드
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/users.model");
const mapRoutes = require("./routes/map.routes");
const postRoutes = require("./routes/post.routes"); // 게시글 라우트

const app = express();

// Middleware

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

// DB username, pw, uri from .env
const username = process.env.DB_USERNAME;
const password = process.env.DB_PW;
const baseUri = process.env.SERVER_URI;

// connet DB
const uri = baseUri
  .replace("<username>", username)
  .replace("<password>", password);

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: "Signup failed" });
  }
});

app.use("/posts", postRoutes); // 게시글 라우트 추가
// Map 관련 라우트 연결
app.use("/bikemap", mapRoutes);

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
