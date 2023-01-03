const UserRepository = require('../repositories/users.repository');

class UserService {
  userRepository = new UserRepository();

  findUserByNickname = async (nickname) => {
    const findUser = await this.userRepository.findUserByNickname(nickname);
    return {
      userId: findUser.userId,
      nickname: findUser.nickname,
      password: findUser.password,
      phoneNumber: findUser.phoneNumber,
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
      password: createUserData.password,
      phoneNumber: createUserData.phoneNumber,
      address: createUserData.address,
      userType: createUserData.userType,
    };
  };

  updateUserPointByNickname = async (point, nickname) => {
    await this.userRepository.updateUserPointByNickname(point, nickname);

    const updateUser = await this.userRepository.findUserByNickname(nickname);

    return {
      userId: updateUser.userId,
      nickname: updateUser.nickname,
      password: updateUser.password,
      phoneNumber: updateUser.phoneNumber,
      address: updateUser.address,
      userType: updateUser.userType,
      point: updateUser.point,
      createdAt: updateUser.createdAt,
      updatedAt: updateUser.updatedAt,
    };
  };
}

module.exports = UserService;
