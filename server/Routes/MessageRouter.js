import express from 'express'
import MessageCtrl from '../Controllers/MessageCtrl.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()
router.post('/message', Auth, MessageCtrl.createMessage)

router.get('/conversations', Auth, MessageCtrl.getConversations)

router.delete('/conversation/:idFriend', Auth, MessageCtrl.deleteConversation)

router.get('/message/:idFriend', Auth, MessageCtrl.getMessages)

router.delete('/message/:idMessage', Auth, MessageCtrl.deleteMessages)



export default router