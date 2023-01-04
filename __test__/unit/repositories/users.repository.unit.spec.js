const UserRepository = require('../../../repositories/users.repository.js');

// users.repository.js 에서는 아래의 Method만을 사용합니다.
let mockUsersModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

let userRepository = new UserRepository(mockUsersModel);

describe('Layered Architecture Pattern Users Repository Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('Users Repository findUserByNickname Method', async () => {
    // findAll Mock의 Return 값을 "findOne String"으로 설정합니다.
    mockUsersModel.findOne = jest.fn(() => {
      return 'findOne String';
    });

    // userRepository의 findUserByNickname Method를 호출합니다.
    const users = await userRepository.findUserByNickname();

    // usersModel의 findAll은 1번만 호출 되었습니다.
    expect(userRepository.usersModel.findOne).toHaveBeenCalledTimes(1);

    // mockUsersModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
    expect(users).toBe('findOne String');
  });

  test('Users Repository createUser Method', async () => {
    // create Mock의 Return 값을 "create String"으로 설정합니다.
    mockUsersModel.create = jest.fn(() => {
      return 'create Return String';
    });

    // createUser Method를 실행하기 위해 필요한 Params 입니다.
    const createUserParams = {
      nickname: 'createUserNickname',
      password: 'createUserPassword',
      phoneNumber: 'createUserPhoneNumber',
      address: 'createUserAddress',
      userType: 'createUserUserType',
    };

    // userRepository의 createUser Method를 실행합니다.
    const createUserData = await userRepository.createUser(
      createUserParams.nickname,
      createUserParams.password,
      createUserParams.phoneNumber,
      createUserParams.address,
      createUserParams.userType
    );

    // createUserData는 usersModel의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createUserData).toBe('create Return String');

    // userRepository의 createUser Method를 실행했을 때, usersModel의 create를 1번 실행합니다.
    expect(mockUsersModel.create).toHaveBeenCalledTimes(1);

    // userRepository의 createUser Method를 실행했을 때, usersModel의 create를 아래와 같은 값으로 호출합니다.
    expect(mockUsersModel.create).toHaveBeenCalledWith({
      nickname: createUserParams.nickname,
      password: createUserParams.password,
      phoneNumber: createUserParams.phoneNumber,
      address: createUserParams.address,
      userType: createUserParams.userType,
    });
  });

  test('Users Repository updateUserPointByNickname Method', async () => {
    // update Mock의 Return 값을 "create String"으로 설정합니다.
    mockUsersModel.update = jest.fn(() => {
      return 'update Return String';
    });

    // updateUserPointByNickname Method를 실행하기 위해 필요한 Params 입니다.
    const updateUserPointParams = {
      point: 'updateUserPoint',
      nickname: 'updateUserNickname',
    };

    // userRepository의 updateUserPointByNickname Method를 실행합니다.
    const updateUserPointData = await userRepository.updateUserPointByNickname(
      updateUserPointParams.point,
      updateUserPointParams.nickname
    );

    // updateUserPointData는 usersModel의 update를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(updateUserPointData).toBe('update Return String');

    // userRepository의 updateUserPointByNickname Method를 실행했을 때, usersModel의 update를 1번 실행합니다.
    expect(mockUsersModel.update).toHaveBeenCalledTimes(1);

    // userRepository의 updateUserPointByNickname Method를 실행했을 때, usersModel의 update를 아래와 같은 값으로 호출합니다.
    expect(mockUsersModel.update).toHaveBeenCalledWith(
      {
        point: updateUserPointParams.point,
      },
      {
        where: { nickname: updateUserPointParams.nickname },
      }
    );
  });
});