const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId, // 연결된 게시물
      ref: "Post",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // 작성자
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // 생성일, 수정일 자동 관리
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
