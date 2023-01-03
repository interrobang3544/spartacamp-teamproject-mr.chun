const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
// 사용자 인증 미들웨어 임포트
const authMiddleware = require('../middlewares/auth-middleware');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { nickname, password, confirm, phoneNumber, address, userType } =
      req.body;
    const existsUsers = await User.findAll({ where: { nickname } });
    const nicknameCheck = /^[A-Za-z0-9]{3,}$/;
    if (existsUsers.length) {
      res.status(412).send({
        errorMessage: '중복된 닉네임입니다.',
      });
      return;
    }
    if (password !== confirm) {
      res.status(412).send({
        errorMessage: '패스워드가 일치하지 않습니다.',
      });
      return;
    }
    if (!nicknameCheck.test(nickname)) {
      res.status(412).send({
        errorMessage: 'ID의 형식이 일치하지 않습니다.',
      });
      return;
    }
    if (password.length < 4) {
      res.status(412).send({
        errorMessage: '패스워드 형식이 일치하지 않습니다.',
      });
      return;
    }
    if (password.includes(nickname) === true) {
      res.status(412).send({
        errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
      });
      return;
    }
    await User.create({ nickname, password, phoneNumber, address, userType });
    if (userType === 0) {
      point = 1000000;
      await User.update({ point }, { where: { nickname } });
    }
    res.status(201).send({
      message: '회원 가입에 성공하였습니다.',
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
    return;
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { nickname, password } = req.body;
    const user = await User.findOne({ where: { nickname } });
    if (!user || password !== user.password) {
      res.status(412).send({
        errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
      });
      return;
    }

    res.send({
      token: jwt.sign({ userId: user.userId }, 'customized-secret-key'),
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: '로그인에 실패하였습니다.',
    });
    return;
  }
});

// 유저 정보 반환 (필요없을까..?)
router.get("/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user,
  });
});


// GET - 회원 정보 조회
// - nickname, phoneNumber, address, point 조회하기
router.get('/', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  try {
    const userInfo = await User.findByPk(
      userId,
      { attributes: ['nickname', 'phoneNumber', 'address', 'point'] }
      // { attributes: {['nickname, phoneNumber, address, point']} }
    );
    return res.status(200).json({ data: userInfo });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '회원 정보 조회에 실패하였습니다.',
    });
  }
});

// PUT - 회원 정보 수정
// 요청 예시: { “phoneNumber”: “010999977777”, ”address”: “바뀐 집 주소” }
// 응답 예시: { message: “회원 정보 수정이 완료되었습니다.” }
router.put('/', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { phoneNumber, address, password, confirm } = req.body;

  if (!phoneNumber || !address) {
    return res.status(412).json({
      errorMessage: '데이터 형식이 올바르지 않습니다.',
      // errorMessage: "전화번호와 주소 중 한 곳이 비었습니다."
    });
  }
  // // 비밀 번호 수정이 가능토록 하려면:
  // // '새 비밀번호'란에 아무것도 없이 수정 요청이 들어온다면 vs 새 비밀번호도 같이 들어온다면
  // // 수정 요청을 보낼 때마다 프론트에서 알아서 '수정 요청용 비밀번호'를
  // // 기존 번호로 넣어서 보내게 하는 건 보안에 좀 안 좋겠지..?
  // if (password.length < 4) {
  //   return res.status(412).send({
  //     errorMessage: '패스워드 형식이 일치하지 않습니다.',
  //   });
  // }
  // if (password !== confirm) {
  //   return res.status(412).send({
  //     errorMessage: '패스워드가 일치하지 않습니다.',
  //   });
  // }
  // if (password.includes(nickname) === true) {
  //   return res.status(412).send({
  //     errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
  //   });
  // }

  try {
    const user = await User.findByPk(userId);
    // 404 Not Found
    // -> 로그인 된 상태라면 해당 유저가 존재하지 않을 가능성은 없으므로.. 스킵

    // 410 Unauthorized
    // -> 자기자신의 것이 아닌 마이페이지를 보고 있을 리 없으므로 이 가능성도 스킵

    // 200
    user.phoneNumber = phoneNumber;
    user.address = address;
    await user.save();
    return res.status(200).json({
      message: '회원 정보 수정이 완료되었습니다.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '회원 정보 수정에 실패하였습니다.',
    });
  }
});

// DELETE - 회원 정보 삭제
// 응답 예시: { message: “탈퇴가 완료되었습니다.” }
router.delete('/', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  try {
    const user = await User.findByPk(userId);
    const deleted = await user.destroy();
    return res.status(200).json({
      message: '탈퇴가 완료되었습니다.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '예기치 못한 문제로 탈퇴 처리에 실패하였습니다.',
    });
  }
});

module.exports = router;
