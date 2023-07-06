/**
 * external imports
 */
const { check, validationResult } = require('express-validator');

/**
 * internal imports
 */
const User = require('../../models/User');

/**
 * add user validator
 */
const addConversationValidators = [
    check("participants")
        .notEmpty()
        .withMessage("Participant required!")
        .trim(),
    check("users")
        .isArray({ min: 2, max: 2 })
        .withMessage("The users array must contain exactly 2 user IDs.!")
        .trim(),
    check("message")
        .notEmpty()
        .withMessage("Message required!")
        .trim(),
    check("timestamp")
        .notEmpty()
        .withMessage("Time required!")
        .trim()
];

/**
 * mapped validation error
 */
const addConversationValidationHandler = function (req, res, next) {
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
    addConversationValidators,
    addConversationValidationHandler
}