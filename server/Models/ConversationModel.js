import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
    recipients: [{ 
        type: mongoose.Types.ObjectId, 
        ref: 'User' 
    }],
    text: String,
    media: Array,
    call: Object
}, {
    timestamps: true
})

const Conversation = mongoose.model('Conversation',ConversationSchema)
export default Conversation