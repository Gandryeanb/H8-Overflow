const route = require('express').Router()
const userController = require('../controllers/userController')
const isLogin = require('../middlewares/isLogin') 

route.post('/register', userController.register)
route.post('/login',userController.login)
route.get('/', isLogin, userController.userData)
route.get('/login/facebook', userController.loginFacebook)

module.exports = route