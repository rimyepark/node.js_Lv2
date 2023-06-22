const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const MyComment = require("../schemas/mycomment");
const MyHomePage = require("../schemas/myhomepage");
const User = require("../schemas/user");

// 전체 게시글 목록 조회 API
router.get("/myhome", async (req, res) => {
  try {
    const myhomepage = await MyHomePage.find({}, { _id: 0, title: 1, nickname: 1, date: 1 }).sort({ date: -1 });
    res.json({ success: true, myhomepage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: "서버 오류" });
  }
});

// 게시글 조회 API
router.get("/myhome/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const myhomepage = await MyHomePage.findById(id);
    if (!myhomepage) {
      return res.status(404).json({ success: false, errorMessage: "게시글을 찾을 수 없습니다." });
    }

    const { title, nickname, date, content } = myhomepage;
    res.json({ success: true, title, nickname, date, content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: "서버 오류" });
  }
});

// 게시글 작성 메서드 (토큰 검사 필요)
router.post("/myhome", authMiddleware, async (req, res) => {
  const { title, date, content } = req.body;
  const { nickname } = res.locals.user; // 변경: nickname으로 수정

  const myhomepage = new MyHomePage({ title, nickname, date, content }); // 변경: nickname으로 수정
  await myhomepage.save();

  res.json({ success: true });
});

// 게시글 수정 메서드 (토큰 및 작성자 검사 필요)
router.put("/myhome/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, date, content } = req.body;

  try {
    const myhomepage = await MyHomePage.findById(id);
    if (!myhomepage) {
      return res.status(404).json({ success: false, errorMessage: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 검사
    const { nickname } = res.locals.user; // 변경: nickname으로 수정

    if (myhomepage.nickname !== nickname) { // 변경: nickname으로 수정
      return res.status(403).json({ success: false, errorMessage: "작성자만 게시글을 수정할 수 있습니다." });
    }

    // 객체 분해 할당을 사용하여 title, date, content 속성만 수정하고 나머지 속성은 유지
    const updatedMyHomePage = await MyHomePage.findByIdAndUpdate(
      id,
      { title, date, content },
      { new: true }
    );

    res.json({ success: true, updatedMyHomePage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: "서버 오류" });
  }
});

// 게시글 삭제 메서드 (토큰 및 작성자 검사 필요)
router.delete("/myhome/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const myhomepage = await MyHomePage.findById(id);

    if (!myhomepage) {
      return res.status(404).json({ success: false, errorMessage: "게시글을 찾을 수 없습니다." });
    }

    // 작성자 검사
    const { nickname } = res.locals.user; // 변경: nickname으로 수정

    if (myhomepage.nickname !== nickname) { // 변경: nickname으로 수정
      return res.status(403).json({ success: false, errorMessage: "작성자만 게시글을 삭제할 수 있습니다." });
    }

    const deletedMyHomePage = await MyHomePage.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errorMessage: "서버 오류입니다." });
  }
});


module.exports = router;
