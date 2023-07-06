/**
 * external imports
 */
const express = require('express');

/**
 * internal imports
 */
const { registerController, loginController } = require('../controllers/authController');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidator');
const { userLoginValidators, userLoginValidationHandler } = require('../middlewares/login/userLoginValidator');

/**
 * express router
 */
const router = express.Router();


/**
 * register user
 */
router.post('/register', addUserValidators, addUserValidationHandler, registerController);

/**
 * login user
*/
router.post('/login', userLoginValidators, userLoginValidationHandler, loginController);

module.exports = router;