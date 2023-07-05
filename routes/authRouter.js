/**
 * external imports
 */
const express = require('express');

/**
 * internal imports
 */
const { registerController } = require('../controllers/authController');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidator');

/**
 * express router
 */
const router = express.Router();

router.post('/register', addUserValidators, addUserValidationHandler, registerController);

module.exports = router;