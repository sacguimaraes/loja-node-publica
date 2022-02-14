'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const authService = require('../Services/auth');

router.get('/',authService.authorize,controller.get);
router.post('/',authService.authorize,controller.post);
module.exports = router;
