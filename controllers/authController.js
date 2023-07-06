/**
 * external imports
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

/**
 * internal imports
 */
const User = require('../models/User');

/**
 * register user
 */
const registerController = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req?.body.name,
            email: req?.body.email,
            password: hashedPassword
        })
        const result = await newUser.save();

        const userObj = {
            name: result?.name,
            email: result?.email,
            _id: result?._id
        }

        const accessToken = jwt.sign(userObj, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        })

        res.status(200).json({
            accessToken,
            user: userObj
        })
    } catch (error) {
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

/**
 * login user
 */
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email
        });

        /**
         * check user exists
         */
        if (user && user._id) {
            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );

            /**
             * password validation
             */
            if (isValidPassword) {
                const userObj = {
                    name: user?.name,
                    email: user?.email,
                    _id: user?._id
                }

                /**
                 * create access token
                 */
                const accessToken = jwt.sign(userObj, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRY
                });

                /**
                 * send response
                 */
                res.status(200).json({
                    accessToken,
                    user: userObj
                });
            } else {
                res.status(401).json({
                    errors: {
                        common: "Invalid Password!"
                    }
                })
            }
        } else {
            res.status(404).json({
                errors: {
                    common: "User not found!"
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

module.exports = {
    registerController,
    loginController
};