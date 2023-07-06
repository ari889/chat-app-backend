/**
 * external imports
 */
const express = require('express');

/**
 * internal imports
 */
const checkLogin = require('../middlewares/auth/checkLogin');
const { getConversationController, addConversation, editConversation } = require('../controllers/conversationController');
const { addConversationValidators, addConversationValidationHandler } = require('../middlewares/conversation/addConversationValidator');
const { editConversationValidators, editConversationValidationHandler } = require('../middlewares/conversation/editConversationValidator');

/**
 * express router
 */
const router = express.Router();

/**
 * get add conversations
 */
router.get('/', checkLogin, getConversationController);

/**
 * add new conversation
 */
router.post('/', checkLogin, addConversationValidators, addConversationValidationHandler, addConversation);

/**
 * edit conversation
 */
router.patch('/:id', checkLogin, editConversationValidators, editConversationValidationHandler, editConversation);

module.exports = router;