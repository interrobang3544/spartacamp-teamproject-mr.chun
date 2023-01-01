const express = require('express');
const router = express.Router();
const { Service } = require('../models');
const authMiddleware = require('../middlewares/auth-middleware');

// GET - 서비스 조회
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 조회
//
router.get('/:serviceId', authMiddleware, async (req, res) => {
  const { serviceId } = req.params;
});

// PUT - 서비스 수정
// 사장님 마이페이지에서 현재 진행중인 세탁 서비스 상태 수정
//
router.put('/', authMiddleware, async (req, res) => {
  const { status } = req.body;
});

module.exports = router;
