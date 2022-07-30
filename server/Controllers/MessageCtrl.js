import Conversation from '../Models/ConversationModel.js'
import Message from '../Models/MessageModel.js'
import User from '../Models/UserModel.js'

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const { sender, text, media, call, recipient } = req.body;
            const recipientUser = await User.findById(recipient);
            if (!recipientUser) {
                return res.status(404).json({msg: "Recipient not found"});
            }

            const conversation = await Conversation.findOneAndUpdate(
                {$and:[
                    {recipient: {$in: [sender, recipient]}},
                    {sender: {$in: [sender, recipient]}}
                ]}
                ,{recipients: [sender, recipient],
                    text,
                    media,
                    call,
                    recipient: recipient,
                    sender: sender
                }
            , { new: true, upsert: true });

            const newMessage = new Message({
                conversation: conversation._id,
                sender,
                recipient,
                text, media, call
            });

            await newMessage.save()

            conversation.lastMsgAt = Date.now();

            await conversation.save();

            res.json({
                newMessage,
                msg: 'Create Success!'
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getConversations: async (req, res) => {
        try {
            const { _id } = req.user;

            const conversations = await new APIfeatures(Conversation.find({
            recipients: {
                $in: [_id],
            },
            }), req.query).paginating().query
            .populate("recipients", "avatar username fullName")
            .sort("-updatedAt")
            .lean();

            res.json({
                conversations,
                result: conversations.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getMessages: async (req, res) => {
        try {
            const conversation = await Conversation.find({
                $and:[{recipients: { $in: [req.user._id]}},
                      {sender: {$in :[req.user._id,req.params.idFriend]}},
                      {recipient: {$in :[req.user._id,req.params.idFriend]}},
                    ]
            })
            if (conversation.length > 0) {
                const messages = await new APIfeatures(Message.find({
        
                    $or: [
                        {sender: req.user._id, recipient: req.params.idFriend},
                        {sender: req.params.idFriend, recipient: req.user._id}
                    ]
                
                }), req.query).paginating().query
                .sort("-createdAt")
    
                res.json({
                    messages,
                    result: messages.length
                })
                
            } else {
                res.json({
                    messages: [],
                    result: 0
                }) 
            }

            // console.log(conversation);



        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteMessages: async (req, res) => {
        try {
            await Message.findOneAndDelete({_id: req.params.idMessage, sender: req.user._id})
 
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteConversation: async (req, res) => {
        try {
            const newConversation = await Conversation.findOneAndUpdate(
                {$and:[
                    {recipient: {$in: [req.user._id, req.params.idFriend]}},
                    {sender: {$in: [req.params.idFriend, req.user._id]}}
                ]}
                ,
                { $pull : { recipients: req.user._id}},
                {new: true}
            )

            if (newConversation.recipients.length === 0) {

                await Message.deleteMany({conversation: newConversation._id})
            }
            
            res.json({msg: 'Delete Success!'})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


export default messageCtrl