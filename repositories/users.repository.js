class UserRepository {
  constructor(UsersModel) {
    this.usersModel = UsersModel;
  }

  findUserByNickname = async (nickname) => {
    const user = await this.usersModel.findOne({ raw: true, where: { nickname } });
    if (user === null) {
      return {};
    }
    return user;
  };

  createUser = async (nickname, password, phoneNumber, address, userType) => {
    const createUserData = await this.usersModel.create({
      nickname,
      password,
      phoneNumber,
      address,
      userType,
    });

    return createUserData;
  };

  updateUserPointByNickname = async (point, nickname) => {
    const updateUserPoint = await this.usersModel.update(
      { point },
      { where: { nickname } }
    );

    return updateUserPoint;
  };
}

module.exports = UserRepository;
