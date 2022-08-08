import express from 'express'
import Auth from "../Middleware/Auth.js"
import UserCtrl from '../Controllers/UserCtrl.js'

const router = express.Router()


router.get('/search', Auth, UserCtrl.searchFullName)

router.get('/user/:id', Auth, UserCtrl.getUser)

router.patch('/user', Auth, UserCtrl.updateUser)

router.patch('/user/:id/follow', Auth, UserCtrl.follow)

router.patch('/user/:id/unFollow', Auth, UserCtrl.unFollow)

router.patch('/user/:id/friendRequest', Auth, UserCtrl.friendRequest)

router.patch('/user/:id/acceptFriend', Auth, UserCtrl.acceptFriend)

router.patch('/user/:id/refuseFriend', Auth, UserCtrl.refuseFriend)

router.patch('/user/:id/cancelFriend', Auth, UserCtrl.cancelFriend)

router.patch('/user/:id/unFriend', Auth, UserCtrl.unFriend)

router.get('/suggestionsUser', Auth, UserCtrl.suggestionsUser)



export default router