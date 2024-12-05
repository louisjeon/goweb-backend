require("dotenv").config(); // 환경 변수 로드

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/users.model");
const mapRoutes = require("./routes/map.routes");
const userRoutes = require("./routes/user.routes"); // 유저 라우트
const postRoutes = require("./routes/post.routes"); // 게시글 라우트
const commentRoutes = require("./routes/comment.routes"); // 댓글 라우트

const app = express();

// CORS 설정
const corsOptions = {
  origin: ["http://localhost:3000", "https://goweb-front.vercel.app"], // 허용할 출처
  methods: "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS", // 허용할 HTTP 메서드
  allowedHeaders: "Content-Type,Authorization", // 허용할 헤더
};

// CORS 미들웨어 설정 (한 번만 적용)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight 요청 처리

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.options("*", (req, res) => {
  res.status(200).send("Preflight request allowed");
});
app.post("/test", (req, res) => {
  const { title, content, author } = req.body;
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-PINGOTHER, Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild"
  );
  res.status(201);
});

// DB username, pw, uri from .env
const username = process.env.DB_USERNAME;
const password = process.env.DB_PW;
const baseUri = process.env.SERVER_URI;

// MongoDB 연결
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

app.use("/users", userRoutes); // 유저 라우트 추가
app.use("/posts", postRoutes); // 게시글 라우트 추가
// Map 관련 라우트 연결
app.use("/bikemap", mapRoutes);
app.use("/comments", commentRoutes); // 댓글 라우트 추가

// 게시글 불러오기
app.get("/board", async (req, res) => {
  const db = (await connectDB).db("test");
  let result = await db
    .collection("comment")
    .find({ postId: req.query.id })
    .sort({ createdAt: -1 })
    .toArray();
  res.status(200).json(result);
});

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;
