import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: { 
        type: String, 
        required: true,
    },
    media: Array,
    call: Object
}, {
    timestamps: true
})

const Message = mongoose.model('Message',MessageSchema)
export default Message