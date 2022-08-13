import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    content: String,
    images: {
        type: Array,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    user: {type: mongoose.Types.ObjectId, ref: 'User'}
}, {
    timestamps: true
})

const Post = mongoose.model('Post',PostSchema)
export default Post