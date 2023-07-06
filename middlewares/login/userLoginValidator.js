/**
 * external imports
 */
const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

/**
 * internal imports
 */
const User = require('../../models/User');

/**
 * add user validator
 */
const userLoginValidators = [
    check("email")
        .exists()
        .withMessage("Email required!")
        .isEmail()
        .withMessage("Invalid email address!")
        .trim(),
    check("password")
        .exists()
        .withMessage("Password required!")
];

/**
 * mapped validation error
 */
const userLoginValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(400).json({
            errors: mappedErrors
        });
    }

}

module.exports = {
    userLoginValidators,
    userLoginValidationHandler
}