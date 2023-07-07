/**
 * internal imports
 */
const Conversation = require('../models/Conversation');
const { findById } = require('../models/Message');

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

        const count = await Conversation.countDocuments();

        res.status(200).json({ conversations, totalCount: count });
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
        await Conversation.populate(result, { path: 'users', select: "_id email name" });

        global.io.emit("conversation", {
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
            await Conversation.updateOne({ _id: id }, { ...req.body });

            const result = await Conversation.findById(id).populate('users', '_id email name');

            global.io.emit("conversation", {
                data: result
            })

            res.status(200).json(result);
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