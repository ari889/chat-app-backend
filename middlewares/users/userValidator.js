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
const addUserValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required!")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Name must not contain anything other than alphabet!")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address!")
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });

                if (user) {
                    throw createError("Email already exists!");
                }
            } catch (error) {
                throw createError(error.message);
            }
        }),
    check("password")
        .notEmpty()
        .withMessage("Password required!")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"),
    check("passwordConfirmation")
        .notEmpty()
        .withMessage("Please enter confirm password!")
        .custom((value, { req }) => {
            try {
                if (value !== req.body.password) {
                    throw createError("Password doesn't match!")
                }

                return true;
            } catch (error) {
                throw createError(error.message);
            }
        })
        .trim()
];

/**
 * mapped validation error
 */
const addUserValidationHandler = function (req, res, next) {
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
    addUserValidators,
    addUserValidationHandler
}