import mongoose from 'mongoose'

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
        unique: true,
        default: 'admin'
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: String,
    },
    tries: {
        type: Number,
        default: 3
    },
    waitTime: {
        type: String,
    }
}, {
    timestamps: true
})


const Admin = mongoose.model('Admin',AdminSchema)
export default Admin