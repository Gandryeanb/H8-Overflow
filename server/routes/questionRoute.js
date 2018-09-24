const route = require('express').Router()
const questionController = require('../controllers/questionController')
const isLogin = require('../middlewares/isLogin') 

route.get('/', questionController.findAllQuestion)
route.post('/', isLogin, questionController.createQuestion)
route.delete('/:id', isLogin, questionController.removeQuestion)
route.put('/:id', isLogin, questionController.updateQuestion)
route.get('/upvote/:id', isLogin, questionController.createUpvote)
route.get('/downvote/:id', isLogin, questionController.createDownvote)

module.exports = route