'use strict';
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const auth = require('../Services/auth');

router.get('/',auth.authorize,controller.get);
router.get('/:slug',auth.authorize,controller.getbyslug);
router.get('/admin/:id',auth.authorize,controller.getbyid);
router.get('/tags/:tags',auth.authorize,controller.getbytag);
router.post('/',auth.Adminstrator,controller.post);
router.put('/:id',auth.Adminstrator,controller.put);
router.delete('/',auth.Adminstrator,controller.delete);
module.exports = router;
