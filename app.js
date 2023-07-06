/**
 * external imports
 */
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const moment = require('moment/moment');
const path = require('path');

/**
 * internal imports
 */
const authRouter = require('./routes/authRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');

/**
 * express app
 */
const app = express();

/**
 * http server
 */
const server = http.createServer(app);

/**
 * dot env config
 */
dotenv.config();

/**
 * add moment globally
 */
app.locals.moment = moment;

/**
 * connect mongoose
 */
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Database connection successful!"))
    .catch(err => console.log(err))

/**
 * root route
 */
app.get("/", (req, res) => {
    res.send("Hello node!");
});


/**
 * json output
 */
app.use(express.json());

/**
 * enable url encode
*/
app.use(express.urlencoded({ extended: true }));

/**
 * get public static folder for file uploads
*/
app.use(express.static(path.join(__dirname, "public")));

/**
 * auth router
 */
app.use("/", authRouter);

/**
 * conversation router
 */
app.use('/conversation', conversationRouter);

/**
 * message router
 */
app.use('/message', messageRouter);

/**
 * server start
 */
server.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
})