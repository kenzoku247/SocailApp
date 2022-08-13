import User from '../Models/UserModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import SendMail from './SendMail.js'

const {CLIENT_URL} = process.env

const AuthCtrl = {
    register: async (req, res) => {
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

            const newUser = {
                firstName, lastName, fullName: newFullName, username: newUserName, email, password: passwordHash, gender
            }
            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/api/activate/${activation_token}`
            SendMail(email, url, "Verify your email address")

            res.json({msg: "Register Success! Please activate your email to start."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {firstName, lastName, fullName, username, email, password, gender} = user

            const check = await User.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new User({
                firstName, lastName, fullName, username, email, password, gender
            })

            await newUser.save()
            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshToken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({
                msg: 'Account has been activated!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body

            const user = await User.findOne({username})
            .populate("followers followings friends", "avatar backgroundCover email fullName followers followings friends")

            if(!user) return res.status(400).json({msg: "This user does not exist."})


            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            if(user.isDisabled) return res.status(400).json({msg: "This account has been banned."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshToken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshToken', {path: '/api/refresh_token'})
            return res.json({msg: "Logged out!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshToken
            if(!rf_token) return res.status(400).json({msg: "Please login now."})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async(err, result) => {
                if(err) return res.status(400).json({msg: "Please login now."})

                const user = await User.findById(result.id).select("-password")
                .populate('followers followings friends', 'avatar backgroundCover username fullName followers followings friends')

                if(!user) return res.status(400).json({msg: "This user does not exist."})

                const access_token = createAccessToken({id: result.id})

                res.json({
                    access_token,
                    user
                })
            })
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await User.findOne({email})
            // console.log(user.password);
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            if(user.isDisabled) return res.status(400).json({msg: "This account has been banned."})

            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/api/reset/${access_token}`

            SendMail(email, url, "Reset your password")
            res.json({
                msg: "Re-send the password, please check your email.",
                user
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await User.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshToken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({
                msg: "Password successfully changed!",
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    googleLogin: async (req, res) => {
        try {
            const {email, email_verified, firstName, lastName, avatar, username} = req.body
            const password = email + process.env.LOGIN_SERVICE_CLIENT_SECRET
            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const user = await User.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                if(user.isDisabled) return res.status(400).json({msg: "This account has been banned."})
                
                const access_token = createAccessToken({id: user._id})
                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    path: '/api/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({
                    msg: "Login success!",
                    access_token,
                    user: {
                        ...user._doc,
                        password: ''
                    }
                })
            }else{
                const newUser = new User({
                    firstName, lastName, fullName: firstName + " " + lastName, email, username, password: passwordHash, avatar: avatar, gender: 'Male'
                })

                await newUser.save()
                
                const access_token = createAccessToken({id: newUser._id})
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    path: '/api/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })
                res.json({
                    msg: "Login success!",
                    access_token,
                    user: {
                        ...newUser._doc,
                        password: ''
                    }
                })
            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

export default AuthCtrl