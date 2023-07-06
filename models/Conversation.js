const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
var conversationSchema = new mongoose.Schema({
    participants: {
        type: String,
        required: true
    },
    users: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        validate: {
            validator: function (array) {
                return array.length === 2;
            },
            message: "The users array must contain exactly 2 user IDs."
        },
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

//Export the model
module.exports = mongoose.model('Conversation', conversationSchema);