import express from 'express'
import AuthCtrl from '../Controllers/AuthCtrl.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()

router.post('/register', AuthCtrl.register)

router.post('/activation', AuthCtrl.activateEmail)

router.post('/login', AuthCtrl.login)

router.post('/google_login', AuthCtrl.googleLogin)

router.post('/forgot', AuthCtrl.forgotPassword)

router.post('/reset', Auth, AuthCtrl.resetPassword)

router.post('/logout', AuthCtrl.logout)

router.post('/refresh_token', AuthCtrl.generateAccessToken)


export default router