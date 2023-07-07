/**
 * external imports
 */
const express = require('express');
const checkLogin = require('../middlewares/auth/checkLogin');
const { getUserController } = require('../controllers/userController');

/**
 * internal imports
 *

/**
 * express router
 */
const router = express.Router();


/**
 * register user
 */
router.get('/:email', checkLogin, getUserController);

module.exports = router;