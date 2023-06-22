// routes/auth.js

const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 로그인 API
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname });

  // 닉네임과 비밀번호가 데이터베이스에 등록된 정보와 일치하는지 확인
  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage: "닉네임 또는 비밀번호를 확인해주세요.",
    });
    return;
  }

  const token = jwt.sign(
    { userId: user.userId },
    "customized-secret-key"
  );

  // JWT를 Cookie로 할당
  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({});
});

module.exports = router;
