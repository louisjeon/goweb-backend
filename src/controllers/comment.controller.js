const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

// 댓글 생성
exports.createComment = async (req, res) => {
  const { content, postId, authorId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 댓글 생성
    const comment = new Comment({
      content,
      post: postId,
      author: authorId,
    });

    await comment.save();

    // 게시글에 댓글 추가
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment", details: error });
  }
};

// 특정 게시물의 댓글 가져오기
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "email"
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments", details: error });
  }
};

// 특정 댓글 가져오기
exports.getCommentById = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId).populate(
      "author",
      "email"
    );
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comment", details: error });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.content = content || comment.content; // 내용 업데이트
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update comment", details: error });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // 댓글 삭제
    await comment.remove();

    // 게시글에서 댓글 제거
    await Post.updateOne(
      { _id: comment.post },
      { $pull: { comments: comment._id } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment", details: error });
  }
};

// 특정 게시물의 댓글 개수 가져오기
exports.getCommentCountByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const commentCount = await Comment.countDocuments({ post: postId });
    res.status(200).json({ postId, commentCount });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch comment count", details: error });
  }
};
