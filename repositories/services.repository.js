// 1. sequelize의 적절한 '모델'을 불러오기
const { Service } = require('../models');
const { Op } = require('sequelize');

// 2. ServiceRepository 클래스 만들기
class ServiceRepository {
  // '사장님이' '진행중인' 세탁 서비스 하나 조회
  findOngoingServiceByOwnerId = async (ownerId) => {
    const service = await Service.findOne({
      where: {
        ownerId: ownerId,
        status: { [Op.ne]: '배송 완료' },
      },
    });
    // console.log("myService: ", myService)
    // myService 자체가 null일 수 있으므로 myService.dataValues를 반환하면 안 됨.
    return service;
  };

  // 서비스id로 서비스 조회 - 사장님과 손님 데이터 붙여서
  findServiceByPkJoined = async (serviceId) => {
    const service = await Service.findOne({
      include: ['owner', 'customer'],
      where: { serviceId },
    });
    return service;
  };

  // 서비스 id로 서비스 조회 - 조인문으로 가져온 데이터
  // 그대로 다시 save()하면 어떻게 될지 몰라서 순수 service 데이터 조회용으로.
  findServiceByPk = async (serviceId) => {
    const service = await Service.findByPk(serviceId);
    return service;
  };

  // 서비스 상태와 맡은 사장님 업데이트
  updateServiceByPk = async (serviceId, status, ownerId) => {
    const updateServiceData = await Service.update(
      { status, ownerId },
      { where: { serviceId } }
    );
    return updateServiceData;
  };

  // // 서비스 상태 업데이트 => 굳이 필요 없는 듯...
  // updateServiceStatusByPk = async (serviceId, status) => {
  //   const updateServiceData = await Service.update(
  //       { status },
  //       { where: { serviceId }}
  //   )
  //   return updateServiceData;
  // }
}

// 3. ServiceRepository 내보내기.
module.exports = ServiceRepository;
