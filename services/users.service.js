const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  findUserByNickname = async (nickname) => {
    const findUser = await this.userRepository.findUserByNickname(nickname);

    return {
      userId: findUser.userId,
      nickname: findUser.nickname,
      password: findUser.title,
      phoneNumber: findUser.content,
      address: findUser.address,
      userType: findUser.userType,
      point: findUser.point,
      createdAt: findUser.createdAt,
      updatedAt: findUser.updatedAt,
    };
  };

  createUser = async (nickname, password, phoneNumber, address, userType) => {
    const createUserData = await this.userRepository.createUser(
      nickname,
      password,
      phoneNumber,
      address,
      userType
    );

    return {
      nickname: createUserData.nickname,
      password: createUserData.title,
      phoneNumber: createUserData.content,
      address: createUserData.address,
      userType: createUserData.userType
    };
  };

  updateUserPointByNickname = async (point, nickname) => {
    await this.userRepository.updateUserPointByNickname(point, nickname);

    const updateUserPoint = await this.userRepository.findUserByNickname(
      nickname
    );

    return {
      point: updateUserPoint.point,
      nickname: updateUserPoint.nickname,
    };
  };
}

module.exports = UserService;
