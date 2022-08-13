import express from 'express'
import Auth from '../Middleware/Auth.js'
import NotifyCtrl from '../Controllers/NotifyCtrl.js'

const router = express.Router()
router.post('/notify', Auth, NotifyCtrl.createNotify)

router.delete('/notify/:id', Auth, NotifyCtrl.removeNotify)

router.get('/notifies', Auth, NotifyCtrl.getNotifies)

router.patch('/isReadNotify/:id', Auth, NotifyCtrl.isReadNotify)

router.delete('/deleteAllNotify', Auth, NotifyCtrl.deleteAllNotifies)



export default router