const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");

// 회원가입
router.post("/signup", async (req, res) => {
  try{
    const { nickname, password, confirm, phoneNumber, address, userType } = req.body;
    const existsUsers = await User.findAll({ where: { nickname }});
    const nicknameCheck = /^[A-Za-z0-9]{3,}$/;
    if (existsUsers.length) {
      res.status(412).send({
        errorMessage: "중복된 닉네임입니다.",
      });
      return;
    }
    if (password !== confirm) {
      res.status(412).send({
        errorMessage: "패스워드가 일치하지 않습니다.",
      });
      return;
    }
    if (!nicknameCheck.test(nickname)) {
      res.status(412).send({
        errorMessage: "ID의 형식이 일치하지 않습니다.",
      });
      return;
    }
    if (password.length < 4) {
      res.status(412).send({
        errorMessage: "패스워드 형식이 일치하지 않습니다.",
      });
      return;
    }
    if (password.includes(nickname) === true) {
      res.status(412).send({
        errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
      });
      return;
    }
    await User.create({ nickname, password, phoneNumber, address, userType });
    if (userType === 0) {
      point = 1000000
      await User.update({ point }, { where: { nickname }});
    }
    res.status(201).send({
      "message": "회원 가입에 성공하였습니다.",
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
    return;
  } 
});


// 로그인
router.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ where: { nickname }});
    if (!user || password !== user.password) {
      res.status(412).send({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
      return;
    }

    res.send({
      token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: "로그인에 실패하였습니다.",
    });
    return;
  }
});

module.exports = router;