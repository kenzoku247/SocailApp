import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    user: {type: mongoose.Types.ObjectId, ref: 'User'},
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', CommentSchema)
export default Comment