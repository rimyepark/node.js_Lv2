const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

// 회원가입 API
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  // 이메일은 필수 필드입니다.
  if (!email) {
    return res.status(400).json({
      errorMessage: "이메일은 필수 입력 사항입니다.",
    });
  }

  // 닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성
  const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
  if (!nicknameRegex.test(nickname)) {
    return res.status(400).json({
      errorMessage: "닉네임은 최소 3자 이상, 알파벳 대소문자와 숫자로 구성되어야 합니다.",
    });
  }

  // 비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함되면 회원가입 실패
  if (password.length < 4 || password.includes(nickname)) {
    return res.status(400).json({
      errorMessage:
        "비밀번호는 최소 4자 이상이어야 하며, 닉네임과 동일한 값을 포함할 수 없습니다.",
    });
  }

  // 비밀번호 확인은 비밀번호와 정확하게 일치
  if (password !== confirmPassword) {
    return res.status(400).json({
      errorMessage: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    });
  }

  // 이메일 중복 확인
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({
      errorMessage: "중복된 이메일입니다.",
    });
  }

  // 닉네임 중복 확인
  const existingNickname = await User.findOne({ nickname });
  if (existingNickname) {
    return res.status(400).json({
      errorMessage: "중복된 닉네임입니다.",
    });
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).json({});
});

module.exports = router;
