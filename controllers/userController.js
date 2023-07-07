const User = require("../models/User");

const getUserController = async (req, res) => {
    const { email } = req.params || {};

    try {
        const user = await User.find({ email: email }).select("-password");

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

module.exports = {
    getUserController
}