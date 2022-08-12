import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10
    },
    fullName: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: 'https://res.cloudinary.com/social-media-nw/image/upload/v1657458657/1656701295600defaultProfile_jodmye.jpg'
    },
    backgroundCover: {
        type: String,
        default: 'https://res.cloudinary.com/social-media-nw/image/upload/v1657980626/ttbvdff37vhrxo287jnr.jpg'
    },
    role: {type: String, default: 'User'},
    gender: {type: String, default: 'Male'},
    mobile: {type: String, default: ''},
    address: {type: String, default: ''},
    story: {
        type: String, 
        default: '',
        maxlength: 200
    },
    website: {type: String, default: ''},
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    followings: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    friends: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    friendsRequest: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    friendsWaitToAccept : [{type: mongoose.Types.ObjectId, ref: 'User'}],
    saved: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    isDisabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


const User = mongoose.model('User',UserSchema)
export default User