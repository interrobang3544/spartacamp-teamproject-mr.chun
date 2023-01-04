const UserService = require('../../../services/users.service.js');

let mockUsersRepository = {
  findUserByNickname: jest.fn(),
  createUser: jest.fn(),
  updateUserPointByNickname: jest.fn(),
};

let userService = new UserService();
// postService의 Repository를 Mock Repository로 변경합니다.
userService.userRepository = mockUsersRepository;

describe('Layered Architecture Pattern Users Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('Users Service findUserByNickname Method', async () => {
    // findUserByNickname Method를 실행했을 때, Return 값 입니다.
    const findUserByNicknameReturnValue = {
      userId: 1,
      nickname: 'Nickname_1',
      password: '1234',
      phoneNumber: '01012345678',
      address: 'Address_1',
      userType: 0,
      point: 1000000,
      createdAt: new Date('06 October 2022 15:50 UTC'),
      updatedAt: new Date('06 October 2022 15:50 UTC'),
    };

    // Repository의 findUserByNickname Method를 Mocking하고, findUserByNicknameReturnValue를 Return 값으로 변경합니다.
    mockUsersRepository.findUserByNickname = jest.fn(() => {
      return findUserByNicknameReturnValue;
    });

    // UserService의 findUserByNickname Method를 실행합니다.
    const User = await userService.findUserByNickname();

    // User의 값이 userRepository의 findUserByNickname Method 결과값이 맞는지 검증합니다.
    expect(User).toEqual(findUserByNicknameReturnValue);

    // UserRepository의 findUserByNickname Method는 1번 호출되었는지 검증합니다.
    expect(mockUsersRepository.findUserByNickname).toHaveBeenCalledTimes(1);
  });

  test('Users Service createUser Method By Success', async () => {
    const createUserReturnValue = {
      nickname: 'Nickname_1',
      password: '1234',
      phoneNumber: '01012345678',
      address: 'Address_1',
      userType: 0,
    };

    mockUsersRepository.createUser = jest.fn(() => {
      return createUserReturnValue;
    });

    const createUser = await userService.createUser(
      'Nickname_1',
      '1234',
      '01012345678',
      'Address_1',
      0
    );

    expect(createUser).toEqual(createUserReturnValue);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
  });

  test('Users Service updateUser Method By Success', async () => {
    const findUserByNicknameReturnValue = {
      userId: 1,
      nickname: 'Nickname_1',
      password: '1234',
      phoneNumber: '01012345678',
      address: 'Address_1',
      userType: 0,
      point: 0,
      createdAt: new Date('06 October 2022 15:50 UTC'),
      updatedAt: new Date('06 October 2022 15:50 UTC'),
    };

    mockUsersRepository.findUserByNickname = jest.fn(() => {
      return findUserByNicknameReturnValue;
    });

    const updateUser = await userService.updateUserPointByNickname(
      1000000,
      'Nickname_1'
    );

    expect(mockUsersRepository.updateUserPointByNickname).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.updateUserPointByNickname).toHaveBeenCalledWith(
      1000000,
      findUserByNicknameReturnValue.nickname
    );

    expect(updateUser).toEqual({
      userId: findUserByNicknameReturnValue.userId,
      nickname: findUserByNicknameReturnValue.nickname,
      password: findUserByNicknameReturnValue.password,
      phoneNumber: findUserByNicknameReturnValue.phoneNumber,
      address: findUserByNicknameReturnValue.address,
      userType: findUserByNicknameReturnValue.userType,
      point: findUserByNicknameReturnValue.point,
      createdAt: findUserByNicknameReturnValue.createdAt,
      updatedAt: findUserByNicknameReturnValue.updatedAt,
    });
  });
});
