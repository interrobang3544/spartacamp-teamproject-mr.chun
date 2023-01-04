// 1. 제3계층 레파지토리 담당('Service'에 맞는)을 불러오기
const ServiceRepository = require('../repositories/services.repository');

// 2. ServiceService 클래스 작성하기
class ServiceService {
  serviceRepository = new ServiceRepository();

  // 1.
  // 2.
  // 3.
  findOngoingServiceByOwnerId = async (ownerId) => {
    const serviceDetail = await this.serviceRepository.findOngoingServiceByOwnerId(
      ownerId
    );
    return serviceDetail;
  };

  // 4.
  findServiceByPkJoined = async (serviceId) => {
    // 에러 메세지를 반환하는 것은 controller의 역할
    const serviceDetail = await this.serviceRepository.findServiceByPkJoined(
      serviceId
    );
    return {
      serviceId: serviceDetail.serviceId,
      customerNickname: serviceDetail.customer.nickname,
      image: serviceDetail.image,
      customerRequest: serviceDetail.customerRequest,
      customerAddress: serviceDetail.customer.address,
      customerPhoneNumber: serviceDetail.customer.phoneNumber,
      status: serviceDetail.status,
      createdAt: serviceDetail.createdAt,
      updatedAt: serviceDetail.updatedAt,
      ownerNickname: serviceDetail.owner ? serviceDetail.owner.nickname : '',
    };
  };

  // 5.
  // 그런데 이 순수 service 데이터는 '수정'할 때 필요한 것인데
  // 이미 save() 루트 말고 .update()로 구현해버렸으면
  // 이제 이 메소드는 필요가 없을 것인가..?
  findServiceByPk = async (serviceId) => {
    const serviceDetail = await this.serviceRepository.findServiceByPk(
      serviceId
    );
    console.log(serviceDetail);
    console.log(serviceDetail.dataValues);
    // 뭘 추출하지?
    return serviceDetail;
  };

  // 6.
  updateServiceByPk = async (serviceId, status, ownerId) => {
    const updatedPost = await this.serviceRepository.updateServiceByPk(
      serviceId,
      status,
      ownerId
    );
    return updatedPost;
  };
}

// 3. ServiceService 클래스 내보내기
module.exports = ServiceService;
