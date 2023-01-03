const express = require('express');
const router = express.Router();
const { Service, User } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');
const { Op } = require('sequelize');

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
      image, customerRequest,
      customerId: userId })
    return res.status(200).json({
      message: '세탁 서비스 신청이 등록되었습니다.'
    })
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '데이터 형식이 올바르지 않습니다.'
    })
  }
})


// GET - 서비스 조회
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
// - 응답 예시: "data":
// { "serviceId": 1,
// “customerNickname”: “빨래 싫어”,
// ”image”: “”,
// ”customerRequest”: “꼼꼼히 부탁드립니다”,
// ”customerAddress”: “제주도 서귀포시”,
// ”customerPhoneNumber”: “01012345678”,
// "ownerNickname": ”Owner1”,
// “status”: “수거 중”,
// "createdAt": "2022-07-25T07:45:56.000Z",
// "updatedAt": "2022-07-25T07:45:56.000Z"}
router.get('/:serviceId', authMiddleware, async (req, res) => {
  const { serviceId } = req.params;
  const user = res.locals.user;
  // 외래키가 설정된 상태에서 조인하기
  // + 다른 '컬럼명'으로 가져오기 (안되면 재빠르게 그냥 노가다로 새 객체 만들어서 반환하기)
  try {
    const serviceDetail = await Service.findOne({
      // raw: true,
      include: ['owner', 'customer'],
      //     [
      //   {
      //   // model: 'User',
      //   as: 'owner',
      //   // association: Service.belongsTo(User, {
      //   //   foreignKey: 'ownerId',
      //   //   constraints: false,
      //   //   as: 'owner',
      //   // }),
      //   // as: 'owner',
      //   attributes: [['nickname', 'ownerNickname']],
      //   // attributes: [],//['nickname', 'ownerNickname']],
      //   // attributes: ['nickname'],
      // }, {
      //   model: 'User',
      //   as: "customer",
      //   // association: Service.belongsTo(User, {
      //   //   foreignKey: 'customerId',
      //   //   constraints: false,
      //   //   as: 'customer'
      //   // }),
      //   // as: 'c',
      //   attributes: [['nickname', 'customerNickname']],
      //   // attributes: [] // ['nickname', 'customerNickname']],
      // }],
      where: { serviceId },
      attributes: [
        'serviceId',
        'image',
        'customerRequest',
        'status',
        'createdAt',
        'updatedAt',
      ],
    });
    const data = {
      serviceId: serviceDetail.serviceId,
      customerNickname: serviceDetail.customer.nickname,
      image: serviceDetail.image,
      customerRequest: serviceDetail.customerRequest,
      customerAddress: serviceDetail.customer.address,
      customerPhoneNumber: serviceDetail.customer.phoneNumber,
      status: serviceDetail.status,
      createdAt: serviceDetail.createdAt,
      updatedAt: serviceDetail.updatedAt,
    };
    if (serviceDetail.owner) {
      data.ownerNickname = serviceDetail.owner.nickname;
    } else {
      data.ownerNickname = '';
    }

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      errorMessage: '서비스 조회에 실패하였습니다.',
    });
  }
});

// PUT - 서비스 수정
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 상태 수정
// - 요청 예시: { “status”: “수거 완료”}
// - 응답 예시: {” message”: “세탁 상태를 업데이트 하였습니다” }
router.put('/:serviceId', authMiddleware, async (req, res) => {
  const { serviceId } = req.params;
  const { status } = req.body;
  const { userId } = res.locals.user;

  // status가 안 들어왔으면 에러 되돌리기
  //
  if (!status) {
    return res.status(412).json({
      errorMessage: '데이터 형식이 올바르지 않습니다.',
    });
  }

  //
  // 세탁 서비스 목록에서 픽업하려는데 이미 진행 중인 세탁물이 있는 경우
  // 1. Services 테이블 전체에서 ownerId가 사장님이고 status가 '배송 완료'가 아닌
  //  세탁 서비스가 있다면 이 사장님이 진행중인 세탁물이 있다는 뜻일 것임.
  // 2. 아니면 사장님마다 '진행중인 세탁물' 컬럼을 따로 만들어야 하나...
  try {
    const alreadyHasOne = await Service.findOne({
      where: {
        ownerId: userId,
        status: { [Op.ne]: '배송 완료' },
      },
    });
    if (alreadyHasOne) {
      return res.status(400).json({
        errorMessage: '이미 진행중인 세탁 서비스가 있습니다.',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      errorMessage: '입력한 데이터가 올바르지 않습니다.',
    });
  }

  // 세탁 상태 업데이트하기
  try {
    const service = await Service.findByPk(serviceId);

    // 401
    // 해당 사용자가 '수정 권한이 있는 사용자인지'도 검사해야할까?

    //
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

    // 대기 중 -> 수거 중 으로 바뀐 경우(사장님이 처음으로 맡게 되었을 때):
    // ownerId란에 사장님 아이디 등록하기. (일단 '수거 중' 이상인 상태의 서비스들에
    // 대해서는 매번 상태 업데이트 떄마다 사장님 id를 재등록하게 만들어 놓음.
    // 사장님Id 정보가 들어있지 않은 데이터가 있을 수 있다는 가정 하에. )
    if (status !== '대기 중') {
      service.ownerId = userId;
    }

    service.status = status;
    await service.save();
    return res.status(200).json({
      message: '세탁 상태를 업데이트 하였습니다.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      errorMessage: '세탁 상태 업데이트에 실패하였습니다.',
    });
  }
});

module.exports = router;
