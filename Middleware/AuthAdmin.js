import User from '../Models/UserModel.js'

const AuthAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req.user.id})

        if(user.role === "User") 
            return res.status(500).json({msg: "Admin resources access denied."})

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


export default AuthAdmin