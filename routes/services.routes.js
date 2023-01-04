// 1. 익스프레스 모듈 임포트하고 라우터 만들기.
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

// 2. 제1계층 컨트롤러 담당('Service'에 맞는) 불러오고
// servicesController라는 이름으로 인스턴스 하나 생성하기.
const ServicesController = require('../controllers/services.controller');
const servicesController = new ServicesController();

// 3. 라우터로 GET과 POST 하나씩 지정해주기.
//      1) 약속된 http 메소드와
//      2) 경로와
//      3) (해당하는 1계층의) 메소드를 미들웨어로 짝지어주기.
router.get('/owner/mypage', authMiddleware, servicesController.getOwnerService);
router.put('/:serviceId', authMiddleware, servicesController.pickupService);
router.put(
  '/:serviceId/mypage',
  authMiddleware,
  servicesController.updateServiceStatus
);

// 4. 라우터 내보내기.
// => 이것은 routes/index.js에서 불려서, 앞에 '/services/'경로를 하나 더 붙이고 다시 내보내지게 된다.
// => 이것은 다시 app.js에서 불리고, 앞에 '/api'경로를 하나 더 붙여서 app에 전역 미들웨어로 등록되게 된다.
module.exports = router;


// 이하는 생략하도록 수정할 것 --------------------------------------
// const { Service, User } = require('../models');
// const { Op } = require('sequelize');

// POST - 서비스 신청
// - 요청 예시: { “nickname”: “빨래_싫어”,
// “phoneNumber”: “01012345678”,
// “address”: “__시 __구 __…”,
// “image”: “../statics/images/img1.jpg”,
// “customerRequest”: “” }
// - 응답 예시: { message: “세탁 서비스 신청이 등록되었습니다.” }
// => 닉네임, 전화번호, 주소가 자동으로 채워져있게 하고, 만약 수정했을 시...ㅠㅠ
router.post('/', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const { image, customerRequest } = req.body;
    const request = await Service.create({
      image,
      customerRequest,
      customerId: userId,
    });
    return res.status(200).json({
      message: '세탁 서비스 신청이 등록되었습니다.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '데이터 형식이 올바르지 않습니다.',
    });
  }
});

// GET - 서비스 조회
// 손님 마이페이지에서 역대 진행한 세탁 서비스들 조회
router.get('/customer', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  try {
    const service = await Service.findAll({
      where: { customerId: userId },
    });
    res.status(200).json({
      data: service,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      errorMessage: '신청한 서비스를 찾지 못했습니다.',
    });
  }
});

// // GET - 서비스 조회
// // 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
// // - 응답 예시: "data":
// // { "serviceId": 1,
// // “customerNickname”: “빨래 싫어”,
// // ”image”: “”,
// // ”customerRequest”: “꼼꼼히 부탁드립니다”,
// // ”customerAddress”: “제주도 서귀포시”,
// // ”customerPhoneNumber”: “01012345678”,
// // "ownerNickname": ”Owner1”,
// // “status”: “수거 중”,
// // "createdAt": "2022-07-25T07:45:56.000Z",
// // "updatedAt": "2022-07-25T07:45:56.000Z"}
// router.get('/owner/mypage', authMiddleware, async (req, res) => {
//   const { userId } = res.locals.user;
//   const myService = await getMyService(userId);
//
//   // 404 Not Found
//   // 현재 진행중인 서비스가 없는 경우
//   if (!myService) {
//     console.log('현재 진행중 서비스 없음 탈출.');
//     return res.status(404).json({
//       errorMessage: '현재 진행중인 세탁 서비스가 없습니다.',
//     });
//   }
//
//   // 현재 진행중인 서비스가 있는 경우
//   const { serviceId } = myService.dataValues;
//   console.log('serviceId : ', serviceId);
//
//   try {
//     const serviceDetail = await Service.findOne({
//       // raw: true,
//       include: ['owner', 'customer'],
//       //     [
//       //   {
//       //   // model: 'User',
//       //   as: 'owner',
//       //   // association: Service.belongsTo(User, {
//       //   //   foreignKey: 'ownerId',
//       //   //   constraints: false,
//       //   //   as: 'owner',
//       //   // }),
//       //   // as: 'owner',
//       //   attributes: [['nickname', 'ownerNickname']],
//       //   // attributes: [],//['nickname', 'ownerNickname']],
//       //   // attributes: ['nickname'],
//       // }, {
//       //   model: 'User',
//       //   as: "customer",
//       //   // association: Service.belongsTo(User, {
//       //   //   foreignKey: 'customerId',
//       //   //   constraints: false,
//       //   //   as: 'customer'
//       //   // }),
//       //   // as: 'c',
//       //   attributes: [['nickname', 'customerNickname']],
//       //   // attributes: [] // ['nickname', 'customerNickname']],
//       // }],
//       where: { serviceId },
//       attributes: [
//         'serviceId',
//         'image',
//         'customerRequest',
//         'status',
//         'createdAt',
//         'updatedAt',
//       ],
//     });
//     const data = {
//       serviceId: serviceDetail.serviceId,
//       customerNickname: serviceDetail.customer.nickname,
//       image: serviceDetail.image,
//       customerRequest: serviceDetail.customerRequest,
//       customerAddress: serviceDetail.customer.address,
//       customerPhoneNumber: serviceDetail.customer.phoneNumber,
//       status: serviceDetail.status,
//       createdAt: serviceDetail.createdAt,
//       updatedAt: serviceDetail.updatedAt,
//       ownerNickname: serviceDetail.owner ? serviceDetail.owner.nickname : '',
//     };
//
//     return res.status(200).json({
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       errorMessage: '서비스 조회에 실패하였습니다.',
//     });
//   }
// });

// // (사장님이)이미 진행중인 세탁 서비스 조회
// async function getMyService(ownerId) {
//   const myService = await Service.findOne({
//     where: {
//       ownerId: ownerId,
//       status: { [Op.ne]: '배송 완료' },
//     },
//   });
//   // console.log("myService: ", myService)
//   // myService 자체가 null일 수 있으므로 myService.dataValues를 반환하면 안 됨.
//   return myService;
// }

// // PUT - 서비스 픽업
// // 대기 중 서비스 목록 중에서 사장님이 서비스 픽업
// // 서비스의 'ownerId'와 'status' 항목 수정.
// router.put('/:serviceId', authMiddleware, async (req, res) => {
//   const { serviceId } = req.params;
//   const { userId, userType } = res.locals.user;
//
//   // 유저 타입이 '사장님(1)'이 아닌 경우 (혹시 모르니)
//   if (!userType) {
//     return res.status(401).json({
//       errorMessage: '"사장님"만 서비스를 픽업할 수 있습니다.',
//     });
//   }
//
//   // 세탁 서비스 목록에서 픽업하려는데 이미 진행 중인 세탁물이 있는 경우
//   try {
//     const alreadyHasOne = await getMyService(userId);
//     console.log(alreadyHasOne);
//     if (alreadyHasOne) {
//       return res.status(400).json({
//         errorMessage: '이미 진행중인 세탁 서비스가 있습니다.',
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({
//       errorMessage: '입력한 데이터가 올바르지 않습니다.',
//     });
//   }
//   try {
//     const service = await Service.findByPk(serviceId);
//     service.ownerId = userId;
//     service.status = '수거 중';
//     await service.save();
//     return res.status(200).json({
//       message: `${serviceId}번 세탁물을 픽업하셨습니다.`,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).json({
//       errorMessage: '세탁물 픽업에 실패하였습니다.',
//     });
//   }
// });

// // PUT - 서비스 수정
// // 사장님 마이페이지에서 현재 진행중인 세탁 서비스 상태 수정
// // - 요청 예시: { “status”: “수거 완료”}
// // - 응답 예시: {” message”: “세탁 상태를 업데이트 하였습니다” }
// router.put('/:serviceId/mypage', authMiddleware, async (req, res) => {
//   const { serviceId } = req.params;
//   console.log(serviceId);
//   const { status } = req.body;
//   console.log('status: ', status);
//   const { userId } = res.locals.user;
//
//   // 400 Bad Request
//   // status가 안 들어왔을 시
//   if (!status) {
//     return res.status(400).json({
//       errorMessage: '데이터 형식이 올바르지 않습니다.',
//     });
//   }
//
//   // 세탁 상태 업데이트하기
//   try {
//     const service = await Service.findByPk(serviceId);
//
//     // 401
//     // 해당 사용자가 '수정 권한이 있는 사용자인지'도 검사해야할까?
//
//     // 400 Bad Request
//     // 수거 완료 → 배송 중 → 배송 완료 의 순서로 업데이트 하지 않은 경우
//     if (service.status === '대기 중' && status !== '수거 중') {
//       return res.status(400).json({
//         errorMessage:
//           '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
//       });
//     }
//     if (service.status === '수거 중' && status !== '수거 완료') {
//       return res.status(400).json({
//         errorMessage:
//           '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
//       });
//     }
//     if (service.status === '수거 완료' && status !== '배송 중') {
//       return res.status(400).json({
//         errorMessage:
//           '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
//       });
//     }
//     if (service.status === '배송 중' && status !== '배송 완료') {
//       return res.status(400).json({
//         errorMessage:
//           '세탁 상태는 "수거 중 -> 수거 완료 → 배송 중 → 배송 완료"의 순서로 업데이트 가능합니다',
//       });
//     }
//
//     service.status = status;
//     await service.save();
//     return res.status(200).json({
//       message: '세탁 상태를 업데이트 하였습니다.',
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).json({
//       errorMessage: '세탁 상태 업데이트에 실패하였습니다.',
//     });
//   }
// });

// module.exports = router;
