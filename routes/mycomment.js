const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const MyComment = require("../schemas/mycomment.js");
const MyHomePage = require("../schemas/myhomepage.js");

// 홈페이지 댓글 조회 API
router.get("/myhome/:title/comments", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;
  const { title } = req.params;

  const myhomepage = await MyHomePage.findOne({ title: title });
  if (!myhomepage) {
    return res.status(404).json({ success: false, errorMessage: "게시글을 찾을 수 없습니다." });
  }

  const homepageComments = await MyComment.find({ title }).select("_id title nickname comment createdAt").sort({ createdAt: -1 });

  res.json({ success: true, comments: homepageComments });
});


// 댓글 작성 API
router.post("/myhome/:title/comments", authMiddleware, async (req, res) => {
  const { title } = req.params;
  const { userId, nickname } = res.locals.user;
  const { comment } = req.body;

  const myhomepage = await MyHomePage.findOne({ title });
  if (!myhomepage) {
    return res.status(404).json({ success: false, errorMessage: "게시글을 찾을 수 없습니다." });
  }

  const newComment = new MyComment({ title, userId, nickname, comment }); // title 추가
  await newComment.save();

  res.json({ success: true });
});


// 댓글 수정 API
router.put("/myhome/:title/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, commentId } = req.params;
  const { comment: newComment } = req.body;

  if (!newComment) {
    return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요." });
  }

  const existingComment = await MyComment.findOne({ _id: commentId });
  if (!existingComment) {
    return res.status(404).json({ success: false, errorMessage: "댓글을 찾을 수 없습니다." });
  }

  if (existingComment.nickname !== nickname) { // 작성자 확인
    return res.status(403).json({ success: false, errorMessage: "작성자만 댓글을 수정할 수 있습니다." });
  }

  existingComment.comment = newComment;
  await existingComment.save();

  res.json({ success: true });
});

// 댓글 삭제 API
router.delete("/myhome/:title/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId, nickname } = res.locals.user;
  const { title, commentId } = req.params;

  const comment = await MyComment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ success: false, errorMessage: "댓글을 찾을 수 없습니다." });
  }

  if (comment.nickname !== nickname) { // 작성자 확인
    return res.status(403).json({ success: false, errorMessage: "작성자만 댓글을 삭제할 수 있습니다." });
  }

  await MyComment.deleteOne({ _id: commentId });

  res.json({ success: true });
});


module.exports = router;
