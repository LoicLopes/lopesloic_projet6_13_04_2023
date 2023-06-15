const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const rateLimiter = require('../middleware/rate-limite');

const validateUser = require('../middleware/user-check');

router.post('/signup', validateUser, userCtrl.signup);
router.post('/login', rateLimiter.loginAccountLimiter, userCtrl.login);

module.exports = router;
