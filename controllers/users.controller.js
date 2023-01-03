const UserService = require('../services/users.service');
const jwt = require('jsonwebtoken');

class UsersController {
  userService = new UserService();

  signup = async (req, res, next) => {
    try {
      const { nickname, password, confirm, phoneNumber, address, userType } =
        req.body;
      const existsUsers = await this.userService.findUserByNickname(nickname);
      console.log(req.body, existsUsers)
      const nicknameCheck = /^[A-Za-z0-9]{3,}$/;
      const phoneNumberCheck = /^[0-9]{11,12}$/;

      if (nickname.length == 0) {
        res.status(412).send({
          errorMessage: '닉네임을 입력해주세요.',
        });
        return;
      } else if (!nicknameCheck.test(nickname)) {
        res.status(412).send({
          errorMessage:
            '닉네임의 형식이 일치하지 않습니다. (영문자와 숫자만 조합가능)',
        });
        return;
      } else if (existsUsers.length) {
        res.status(412).send({
          errorMessage: '중복된 닉네임입니다.',
        });
        return;
      }

      if (password.length == 0) {
        res.status(412).send({
          errorMessage: '패스워드를 입력해주세요.',
        });
        return;
      } else if (password.length < 4) {
        res.status(412).send({
          errorMessage:
            '패스워드 형식이 일치하지 않습니다. (4자리 이상만 가능)',
        });
        return;
      } else if (password.includes(nickname) === true) {
        res.status(412).send({
          errorMessage: '패스워드에 닉네임이 포함되어 있습니다.',
        });
        return;
      } else if (password !== confirm) {
        res.status(412).send({
          errorMessage: '패스워드가 일치하지 않습니다.',
        });
        return;
      }

      if (phoneNumber.length == 0) {
        res.status(412).send({
          errorMessage: '전화번호를 입력해주세요.',
        });
        return;
      } else if (!phoneNumberCheck.test(phoneNumber)) {
        res.status(412).send({
          errorMessage:
            '전화번호의 형식이 일치하지 않습니다. ( -없이 11자리만 가능 )',
        });
        return;
      }

      if (address.length == 0) {
        res.status(412).send({
          errorMessage: '주소를 입력해주세요.',
        });
        return;
      }

      if (userType !== 0 && userType !== 1) {
        res.status(412).send({
          errorMessage: '사용자 유형을 선택하지 않았습니다.',
        });
        return;
      }

      await this.userService.createUser(
        nickname,
        password,
        phoneNumber,
        address,
        userType
      );

      if (userType === 0) {
        point = 1000000;
        await this.userService.updateUserPointByNickname(point, nickname);
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
  };

  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      
      console.log("con", user)
      if (!nickname) {
        res.status(412).send({
          errorMessage: '닉네임을 입력해주세요.',
        });
        return;
      } 
      
      try {
        await this.userService.findUserByNickname(nickname);
      } catch(err) {
        res.status(412).send({
          errorMessage: '존재하지 않는 닉네임 입니다.',
        });
      }

      if (!password) {
        res.status(412).send({
          errorMessage: '패스워드를 입력해주세요.',
        });
        return;
      } else if (password !== user.password) {
        res.status(412).send({
          errorMessage: '패스워드가 틀렸습니다.',
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
  };
}

module.exports = UsersController;
