import express from 'express'
import MessageCtrl from '../Controllers/MessageCtrl.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()
router.post('/message', Auth, MessageCtrl.createMessage)

router.get('/conversations', Auth, MessageCtrl.getConversations)

router.get('/message/:id', Auth, MessageCtrl.getMessages)

router.delete('/message/:id', Auth, MessageCtrl.deleteMessages)

router.delete('/conversation/:id', Auth, MessageCtrl.deleteConversation)


export default router