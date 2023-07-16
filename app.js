/**
 * external imports
 */
const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const moment = require('moment/moment');
const path = require('path');
const cors = require('cors');
const socketIO = require('socket.io');

/**
 * internal imports
 */
const authRouter = require('./routes/authRouter');
const conversationRouter = require('./routes/conversationRouter');
const messageRouter = require('./routes/messageRouter');
const userRouter = require('./routes/userRouter');
const { notFoundHandler, commonErrorHandler } = require('./middlewares/common/errorHandler');

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
 * apply cors
 */
const corsOptions = {
    origin: process.env.CLIENT_HOST, // Set the allowed origin(s)
    methods: ['GET', 'POST', "PATCH"],     // Set the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Set the allowed headers
    credentials: true             // Enable CORS credentials
};
app.use(cors(corsOptions));

/**
 * socket creation
 */
const io = socketIO(server, {
    cors: corsOptions
});

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("disconnect", () => {
        console.log("User disconnected" + socket.id);
    })
})

/**
 * apply socket globally
 */
global.io = io;

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
app.use('/conversations', conversationRouter);

/**
 * message router
 */
app.use('/messages', messageRouter);

/**
 * user router
 */
app.use('/users', userRouter);

/**
 * 404 not found
 */
app.use(notFoundHandler);

/**
 * common error handler
 */
app.use(commonErrorHandler);

/**
 * server start
 */
server.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}`);
})