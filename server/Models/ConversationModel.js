import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
    recipients: [{ 
        type: mongoose.Types.ObjectId, 
        ref: 'User' 
    }],
    recipient: { type: mongoose.Types.ObjectId, ref: 'User' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    lastMsgAt: {
        type: Date,
    },
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation',ConversationSchema)
export default Conversation