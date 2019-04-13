import AuthService = require('../auth/authService')
import express = require('express')

const router = express.Router()

router.post('/login', AuthService.login)
// router.post('/signup', AuthService.signup)
router.post('/validateToken', AuthService.validateToken)
router.post('/googleLogin', AuthService.googleLogin)

module.exports = router
