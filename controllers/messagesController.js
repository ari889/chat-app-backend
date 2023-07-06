/**
 * internal imports
 */
const Message = require('../models/Message');

/**
 * get all message
 */
const getMessageController = async (req, res) => {
    const { start, limit } = req.query;
    const conversationId = req.params.id;


    try {
        const query = Message.find({
            sender: req.user._id
        });

        if (conversationId) {
            query.find({ conversationId: conversationId });
        }

        if (start) {
            query.skip(Number(start));
        }

        if (limit) {
            query.limit(Number(limit));
        }

        const messages = await query.populate('sender', 'name email _id').populate('receiver', 'name email, _id').sort({ timestamp: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

/**
 * add message
 */
const addMessageController = async (req, res) => {
    try {
        const message = new Message({
            ...req.body,
            sender: req?.user?._id
        })

        const result = await message.save();

        global.io.emit("message", {
            data: result
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

module.exports = {
    getMessageController,
    addMessageController
}