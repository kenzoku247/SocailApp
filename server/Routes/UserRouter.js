import express from 'express'
import Auth from "../Middleware/Auth.js"
import UserCtrl from "../Controllers/UserCtrl.js"

const router = express.Router()



router.get('/searchU', Auth, UserCtrl.searchUser)

router.get('/searchF', Auth, UserCtrl.searchFullName)

router.get('/searchE', Auth, UserCtrl.searchEmail)

router.get('/user/:id', Auth, UserCtrl.getUser)

router.patch('/user', Auth, UserCtrl.updateUser)

router.patch('/user/:id/follow', Auth, UserCtrl.follow)

router.patch('/user/:id/unFollow', Auth, UserCtrl.unFollow)

router.patch('/user/:id/addFriend', Auth, UserCtrl.addFriend)

router.patch('/user/:id/unFriend', Auth, UserCtrl.unFriend)

router.get('/suggestionsUser', Auth, UserCtrl.suggestionsUser)



export default router