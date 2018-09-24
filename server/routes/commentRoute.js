const route = require('express').Router()
const commentController = require('../controllers/commentController')
const isLogin = require('../middlewares/isLogin')

route.post('/', isLogin, commentController.createComment)
route.delete('/', isLogin, commentController.removeComment)

module.exports = route