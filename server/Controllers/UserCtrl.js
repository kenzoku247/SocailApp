import User from '../Models/UserModel.js'

const UserCtrl = {
    searchFullName: async (req, res) => {
        try {
            const users = await User.find({fullName: {$regex: req.query.fullName}})
            .limit(10).select("fullName username avatar followings followers friends friendsRequest friendsWaitToAccept")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select('-password')
            .populate("followers followings friends friendsRequest friendsWaitToAccept", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { avatar, backgroundCover, firstName, lastName, mobile, address, story, website, gender } = req.body
            if(!firstName) return res.status(400).json({msg: "Please add your first name."})
            if(!lastName) return res.status(400).json({msg: "Please add your last name."})
            
            const newFullName = firstName + ' ' + lastName

            await User.findOneAndUpdate({_id: req.user._id}, {
                firstName: firstName,lastName: lastName, avatar, backgroundCover, fullName: newFullName, mobile, address, story, website, gender
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await User.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers followings", "-password")

            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {followings: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unFollow: async (req, res) => {
        try {

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers followings", "-password")

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {followings: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    friendRequest: async (req,res) => {
        try {
            const user = await User.find({_id: req.params.id, friends: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You have friended this user."})
            
            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {friendsRequest: req.params.id}
            }, {new: true})

            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $push: {friendsWaitToAccept: req.user._id}
            }, {new: true}).select("-password")

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    acceptFriend: async (req,res) => {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $push: {friends: req.user._id},
                $pull: {friendsRequest: req.user._id}
            }, {new: true}).populate("friends", "-password")
            
            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {friends: req.params.id},
                $pull: {friendsWaitToAccept: req.params.id}   
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refuseFriend: async (req,res) => {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {friendsRequest: req.user._id}
            }, {new: true}).select("-password")
            
            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {friendsWaitToAccept: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    cancelFriend: async (req,res) => {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {friendsWaitToAccept: req.user._id}
            }, {new: true}).select("-password")
            
            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {friendsRequest: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unFriend: async (req,res) => {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {friends: req.user._id}
            }, {new: true}).populate("friends", "-password")

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {friends: req.params.id}
            }, {new: true})

            res.json({newUser})
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.followings, req.user._id]

            const num  = req.query.num || 10

            const users = await User.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'followings', foreignField: '_id', as: 'followings' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
}


export default UserCtrl