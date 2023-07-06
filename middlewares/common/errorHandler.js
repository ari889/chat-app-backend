/**
 * 404 not found handler
 */

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        errors: {
            common: "Your requested resource was not found!"
        }
    });
}

/**
 * common error handler
 */
const commonErrorHandler = (err, req, res, next) => {
    const error = process.env.NODE_ENV === 'development' ? err : "Internal server error!";
    res.status(500).json({
        errors: {
            common: error
        }
    });
}


module.exports = {
    notFoundHandler,
    commonErrorHandler
}