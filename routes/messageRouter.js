/**
 * external imports
 */
const express = require('express');

/**
 * internal imports
 */
const checkLogin = require('../middlewares/auth/checkLogin');
const { addMessageValidators, addMessageValidationHandler } = require('../middlewares/message/addMessageValidator');
const { getMessageController, addMessageController } = require('../controllers/messagesController');

/**
 * express router
 */
const router = express.Router();

/**
 * get add message
 */
router.get('/', checkLogin, getMessageController);

/**
 * add new message
 */
router.post('/', checkLogin, addMessageValidators, addMessageValidationHandler, addMessageController);

module.exports = router;