/**
 * external imports
 */
const jwt = require('jsonwebtoken');

/**
 * check login for private route
 */
const checkLogin = (req, res, next) => {
    const token = req?.headers?.authorization.split(" ")[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({
                error: {
                    common: "Unauthorized access blocked!"
                }
            })
        }
    }
}

module.exports = checkLogin;