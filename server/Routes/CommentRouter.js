import express from 'express'
import CommentCtrl from '../Controllers/commentCtrl.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()
router.post('/comment', Auth, CommentCtrl.createComment)

router.patch('/comment/:id', Auth, CommentCtrl.updateComment)

router.patch('/comment/:id/like', Auth, CommentCtrl.likeComment)

router.patch('/comment/:id/unlike', Auth, CommentCtrl.unLikeComment)

router.delete('/comment/:id', Auth, CommentCtrl.deleteComment)



export default router