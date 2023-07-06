/**
 * internal imports
 */
const Conversation = require('../models/Conversation');

/**
 * get all conversations
 */
const getConversationController = async (req, res) => {
    const { participants, start, limit } = req.query;


    try {
        const query = Conversation.find();

        if (participants) {
            if (Array.isArray(participants)) {
                const [participant1, participant2] = participants;
                query.find({
                    $or: [
                        { participants: participant1 },
                        { participants: participant2 }
                    ]
                });
            } else if (typeof participants === 'string') {
                query.find({ participants: { $regex: `\\b${participants}\\b`, $options: 'i' } });
            }
        }

        if (start) {
            query.skip(Number(start));
        }

        if (limit) {
            query.limit(Number(limit));
        }

        const conversations = await query.populate('users', 'email name _id').sort({ timestamp: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        console.log(Error)
        res.status(500).json({
            errors: {
                common: error.message
            }
        })
    }
}

/**
 * add conversation
 */
const addConversation = async (req, res) => {
    try {
        const conversation = new Conversation({
            ...req.body
        })

        const result = await conversation.save();

        global.importScripts.emit("conversation", {
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

/**
 * edit conversation
 */
const editConversation = async (req, res) => {
    const id = req?.params?.id;

    if (id) {
        try {
            const conversation = await Conversation.updateOne({ _id: id }, { ...req.body });

            global.io.emit("conversation", {
                data: conversation
            })

            res.status(200).json(conversation);
        } catch (error) {
            res.status(500).json({
                errors: {
                    common: error.message
                }
            })
        }
    }
}

module.exports = {
    getConversationController,
    addConversation,
    editConversation
}