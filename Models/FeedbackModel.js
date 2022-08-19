import mongoose from 'mongoose'

const FeedbackSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, ref: "User"},
    content: { 
        type: String,
        maxlength: 500,
        required: true
    },
    solved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Feedback = mongoose.model('Feedback',FeedbackSchema)
export default Feedback