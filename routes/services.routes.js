const express = require('express');
const router = express.Router();
const { Service } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');


// POST - 서비스 신청 
// 고객 서비스 신청
//
router.post('/', authMiddleware , async(req , res) => {
const {userId} = res.locals.user;
try { 
  const { image, customerRequest} = req.body;
  const requsest = await Service.create({
    image, customerRequest,
    customerId: userId})
    return res.status(200).json({
      message: ' 세탁 등록'
    })
} catch(error){
  console.log(error.message);
  return res.status(400).json({
    errorMessage: '데이터 형식이 올바르지 않습니다.'
  })
}
})


// GET - 서비스 조회
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
//
router.get('/customer', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user
  // const {customerId} = req.params 
  try{
    const service = await Service.findAll({
      where: {customerId:userId} 
    });
    res.status(200).json({
      data : service
    });
  } catch (error) {
    console.log(error.message)
    res.status(400).send({
      errorMessage: "신청한 서비스를 못찾았습니다."
    });   
  }
})

// PUT - 서비스 수정
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 상태 수정
//
router.put('/customer/put', authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const {CustomerRequest} = req.body;
 try{
    const user = await Service.findByPk(userId)
    user.customerRequest = CustomerRequest;
    await user.save();
    return res.status(200).json({
      message: '요청사항이 변경되었습니다.',
    });
 }catch (error) {
  console.log(error.message)
  res.status(400).send({
    errorMessage: "대기중일때만 수정 가능합니다."
  });   
}
  
});

module.exports = router;
