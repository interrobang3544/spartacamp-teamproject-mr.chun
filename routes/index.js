const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
const servicesRouter = require('./services.routes');

router.use('/users', usersRouter);
// router.use('/services', servicesRouter);

module.exports = router;
