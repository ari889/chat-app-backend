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

module.exports = {
    registerController
};