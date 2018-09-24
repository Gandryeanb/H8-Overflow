const route = require('express').Router()
const AnswerController = require('../controllers/answerController')
const isLogin =  require('../middlewares/isLogin')

route.post('/:id', isLogin, AnswerController.createAnswer)
route.put('/:id', isLogin, AnswerController.updateAnswer)
route.get('/upvote/:id', isLogin, AnswerController.createUpvote)
route.get('/downvote/:id', isLogin, AnswerController.createDownvote)

module.exports = route