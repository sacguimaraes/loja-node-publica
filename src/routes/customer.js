'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const auth = require('../Services/auth');

router.get('/',auth.authorize,controller.get);
router.post('/',auth.Adminstrator,controller.post);
router.post('/refresh-token',auth.authorize,controller.refreshToken);
router.post('/authenticate',controller.authenticate);
module.exports = router;
