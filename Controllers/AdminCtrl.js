import Admin from "../Models/AdminModel.js";
import User from "../Models/UserModel.js";
import Post from "../Models/PostModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SendPasswordToAdmin from './SendPasswordToAdmin.js'

const AdminCtrl = {
    getPassword: async (req, res) => {
        try {
            const { username } = req.body
            const idAdmin = req.params.id

            const newPassword = (Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10))
            const passwordHash = await bcrypt.hash(newPassword,12)

            const administrator = await Admin.findOne(
                {username : username}
            )
            
            const adminUser = await User.findOne({_id: idAdmin})
            console.log(adminUser.email);

            if (!administrator)
                {
                    await Admin.create({
                    username: username,
                    password: passwordHash})  
                    SendPasswordToAdmin(adminUser.email,passwordHash)
                    
                }
            else {

                SendPasswordToAdmin(adminUser.email,administrator.password)
            }    
            res.json("Success! Check your mail to see the password.")

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req,res) => {
        try {
            const { username, password } = req.body

            const adminUser = await Admin.findOne({username: username})
            const Notries = adminUser.tries
            const timeNow = new Date().getTime()
            
            if (adminUser.waitTime > timeNow) {
                return res.status(400).json({msg: "Cannot login for 5 minutes."})
            } else {
                if(password !== adminUser.password) {
                    if (Notries === 0) {
                        await adminUser.update({waitTime: new Date().getTime() + 1000 * 60 * 5})
                        return res.status(400).json({msg: "Cannot login for 5 minutes."})
                    } else {
                        await adminUser.update({tries: Notries - 1})
                        return res.status(400).json({msg: "Password is incorrect."})
                    }
    
                }
    
                const newPassword = await bcrypt.hash((Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10)),12)
                await Admin.findOneAndUpdate(
                    {username: username},
                    {
                        password: newPassword,
                        lastLogin: new Date(),
                        tries: 3
                    }
                )
                
                const access_admin_token = createAccessToken({id: adminUser._id})
                const refresh_admin_token = createRefreshToken({id: adminUser._id})

                res.cookie('refreshAdminToken', refresh_admin_token, {
                    httpOnly: true,
                    path: '/admin/refresh_admin_token',
                    maxAge: 5*60*60*1000 // 5 hours
                })

                res.json({msg: 'Login Success!',access_admin_token,})
            }

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    generateAdminAccessToken: async (req, res) => {
        try {
            const rf_admin_token = req.cookies.refreshAdminToken
            if(!rf_admin_token) return res.status(400).json({msg: "Please login now."})

            jwt.verify(rf_admin_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                const access_admin_token = createAccessToken({id: result && result.id})

                res.json({
                    access_admin_token
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshAdminToken', {path: '/admin/refresh_admin_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    searchUser: async (req, res) => {
        try {
            const users = await User.find({fullName: {$regex: req.query.fullName}})
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find().select('-password')

            res.json({users})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find().sort('-createdAt')

            res.json({posts})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    setRole: async (req, res) => {
        const {role} = req.body
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.id},
                {role: role}, 
                {new: true}
            )

            res.json({user})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    setDisable: async (req, res) => {
        const {isDisabled} = req.body
        try {
            const user = await User.findOneAndUpdate(
                {_id: req.params.id},
                {isDisabled: !isDisabled}, 
                {new: true}
            )

            res.json({user})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            await Post.deleteMany({user: req.params.id})

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createUser: async (req, res) => {
        try {
            const { firstName, lastName, username, email, password, gender } = req.body
            const newFullName = firstName + ' ' + lastName
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_email = await User.findOne({email})
            if(user_email) return res.status(400).json({msg: "This email already exists."})
            
            const user_name = await User.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: "This user name already exists."})

            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new User({
                firstName, lastName, fullName: newFullName, username: newUserName, email, password: passwordHash, gender
            })

            await newUser.save()

            const resUser = await User.findOne({email: email}).select('-password')

            res.json({
                msg: "Deleted Success!",
                user: resUser
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deletePost: async (req, res) => {
        try {
            await Post.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1h'})
}

export default AdminCtrl