const { User } = require('../models');

class UserRepository {
  findUserByNickname = async (nickname) => {
    const user = await User.findOne({ raw: true, where: { nickname } });
    if (user === null) {
      return {};
    }
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
    console.log(updateUserPoint);

    return updateUserPoint;
  };

  findUserByPk = async (userId) => {
    const user = await User.findByPk(userId);
    return user;
  }

  updateUserInfoByPk = async (userId, phoneNumber, address) => {
    const updatedUserData = await User.update(
      { phoneNumber, address },
      { where: { userId } },
      // { where: { userId, password } }
    );
    return updatedUserData;
  }

  deleteUserByPk = async (userId) => {
    const deletedUserData = await User.destroy({
      where: { userId }
      // where: { userId, password }
    });
    return deletedUserData;
  }
}

module.exports = UserRepository;
