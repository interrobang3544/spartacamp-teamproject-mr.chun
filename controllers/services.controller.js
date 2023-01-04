const Services_Service = require('../services/services.service');

class ServicesController{
    services_Service = new Services_Service();
// 빨래서비스 신청
    requsest = async(req , res ,next) => {
        const {userId} = res.locals.user;
        const service = await this.services_Service.//
        try { 
        const { image, customerRequest} = req.body;
        const requsest = await Service.create({
            image, customerRequest,
            customerId: userId})
            return res.status(200).json({
            message: '세탁 서비스 신청이 등록되었습니다.'
            })
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
            errorMessage: '데이터 형식이 올바르지 않습니다.'
            })
        }

    }
// 내 서비스 신청목록 조회
    customerinfo = async(req , res, next) =>{
        const {userId} = res.locals.user
        try{
            const service = await Service.findAll({
            where: {customerId:userId} , order:[['serviceId','DESC']] // 내림
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
    }
}
module.exports = ServicesController;