// 1. 제2계층 서비스 담당('Service'에 맞는)을 불러오기
const ServiceService = require('../services/services.service');
const { Service } = require('../models');

// 2. ServicesController 클래스 작성하기
class ServicesController {
  serviceService = new ServiceService();

  // 서비스 신청
  postService = async (req, res, next) => {

  };

  // 손님 마이페이지에서 역대 서비스 목록 보기
  getCustomerServices = async (req, res, next) => {

  };

  // 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
  getOwnerService = async (req, res, next) => {
    const { userId } = res.locals.user;
    const myService = await this.serviceService.findOngoingServiceByOwnerId(userId);

    // 404 Not Found
    // 현재 진행중인 서비스가 없는 경우
    if (!myService) {
      console.log('현재 진행중 서비스 없음 탈출.');
      return res.status(404).json({
        errorMessage: '현재 진행중인 세탁 서비스가 없습니다.',
      });
    }

    // 현재 진행중인 서비스가 있는 경우
    const { serviceId } = myService.dataValues;
    try {
      const data = await this.serviceService.findServiceByPkJoined(serviceId);
      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        errorMessage: '서비스 조회에 실패하였습니다.',
      });
    }
  };

  // 서비스 목록에서 서비스 픽
  pickupService = async (req, res, next) => {
    const { serviceId } = req.params;
    const { userId, userType } = res.locals.user;

    // 유저 타입이 '사장님(1)'이 아닌 경우 (혹시 모르니)
    if (!userType) {
      return res.status(401).json({
        errorMessage: '"사장님"만 서비스를 픽업할 수 있습니다.',
      });
    }

    // 세탁 서비스 목록에서 픽업하려는데 이미 진행 중인 세탁물이 있는 경우
    try {
      const alreadyHasOne =
        await this.serviceService.findOngoingServiceByOwnerId(userId);
      console.log(alreadyHasOne);
      if (alreadyHasOne) {
        return res.status(400).json({
          errorMessage: '이미 진행중인 세탁 서비스가 있습니다.',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        errorMessage:
          '(진행중 서비스 조회중)입력한 데이터가 올바르지 않습니다.',
      });
    }

    // 서비스 상태 업데이트하기(ownerId 추가, status='수거 중'으로 수정)
    try {
      const updatedService = await this.serviceService.updateServiceByPk(
        serviceId,
        '수거 중',
        userId
      );
      console.log(updatedService);
      return res.status(200).json({
        message: `${serviceId}번 세탁물을 픽업하셨습니다.`,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage: '(서비스 업데이트중)세탁물 픽업에 실패하였습니다.',
      });
    }
  };

  // 서비스 상태 업데이트 진행("수거 중 -> 수거 완료 → 배송 중 → 배송 완료" 순서로)
  updateServiceStatus = async (req, res, next) => {
    const { serviceId } = req.params;
    const { status } = req.body;
    const { userId } = res.locals.user;

    // 400 Bad Request
    // status가 안 들어왔을 시
    if (!status) {
      return res.status(400).json({
        errorMessage: '데이터 형식이 올바르지 않습니다.',
      });
    }

    // 세탁 상태 업데이트하기
    try {
      const service = await this.serviceService.findServiceByPk(serviceId);

      // 401
      // 해당 사용자가 '수정 권한이 있는 사용자인지'도 검사해야할까?

      // 400 Bad Request
      // 수거 완료 → 배송 중 → 배송 완료 의 순서로 업데이트 하지 않은 경우
      if (service.status === '대기 중' && status !== '수거 중') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '수거 중' && status !== '수거 완료') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '수거 완료' && status !== '배송 중') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }
      if (service.status === '배송 중' && status !== '배송 완료') {
        return res.status(400).json({
          errorMessage:
            '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
        });
      }

      // 서비스 상태 업데이트 진행
      const updatedService = await this.serviceService.updateServiceByPk(
        serviceId,
        status,
        userId
      );
      return res.status(200).json({
        message: '세탁 상태를 업데이트 하였습니다.',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        errorMessage:
          '(서비스 조회와 업데이트중)세탁 상태 업데이트에 실패하였습니다.',
      });
    }
  };
}

// 3. ServicesController 클래스 내보내기
//  => 이것은 posts.routes.js에서 (제0계층) 라우터가 사용하게 된다.
module.exports = ServicesController;
