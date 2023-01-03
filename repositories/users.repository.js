const { User } = require('../models');

class UserRepository {
  findUserByNickname = async (nickname) => {
    const user = await User.findOne({ where: nickname });

    return user;
  };

  createUser = async (nickname, password, phoneNumber, address, userType) => {
    const createUserData = await User.create({
      nickname,
      password,
      phoneNumber,
      address,
      userType,
    });

    return createUserData;
  };

  updateUserPointByNickname = async (point, nickname) => {
    const updateUserPoint = await User.update(
      { point },
      { where: { nickname } }
    );

    return updateUserPoint;
  };
}

module.exports = UserRepository;
