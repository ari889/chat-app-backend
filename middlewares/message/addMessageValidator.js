/**
 * external imports
 */
const { check, validationResult } = require('express-validator');

/**
 * add user validator
 */
const addMessageValidators = [
    check("conversationId")
        .isMongoId()
        .withMessage("Invalid conversation ID!")
        .trim(),
    check("receiver")
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
const addMessageValidationHandler = function (req, res, next) {
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
    addMessageValidators,
    addMessageValidationHandler
}