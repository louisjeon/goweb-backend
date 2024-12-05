const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// 유저 관련 라우트
router.post("/signup", userController.signup); // 회원가입
router.get("/", userController.getAllUsers); // 모든 유저 조회 (Optional)
router.get("/:userId", userController.getUserById); // 특정 유저 조회 (Optional)

module.exports = router;
