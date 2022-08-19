import express from 'express'
import AdminCtrl from '../Controllers/AdminCtrl.js'
import AuthAdmin from '../Middleware/AuthAdmin.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()

router.post('/getPassword/:id',Auth, AuthAdmin, AdminCtrl.getPassword)

router.post('/login',Auth, AuthAdmin, AdminCtrl.login)

router.post('/refresh_admin_token',Auth, AuthAdmin, AdminCtrl.generateAdminAccessToken)

router.post('/logout', AdminCtrl.logout)

router.get('/search', Auth, AdminCtrl.searchUser)

router.get('/user',Auth, AuthAdmin, AdminCtrl.getAllUsers)

router.get('/post',Auth, AuthAdmin, AdminCtrl.getAllPosts)

router.get('/feedback',Auth, AuthAdmin, AdminCtrl.getAllFeedbacks)

router.patch('/setRole/:id',Auth, AuthAdmin, AdminCtrl.setRole)

router.patch('/setDisable/:id',Auth, AuthAdmin, AdminCtrl.setDisable)

router.delete('/deleteUser/:id',Auth, AuthAdmin, AdminCtrl.deleteUser)

router.post('/createUser',Auth, AuthAdmin, AdminCtrl.createUser)

router.delete('/deletePost/:id',Auth, AuthAdmin, AdminCtrl.deletePost)

router.patch('/solvedFeedback/:id',Auth, AuthAdmin, AdminCtrl.solvedFeedback)

router.delete('/deleteFeedback/:id',Auth, AuthAdmin, AdminCtrl.deleteFeedback)


export default router