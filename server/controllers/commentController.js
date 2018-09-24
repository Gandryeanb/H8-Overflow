const Comment = require('../models/commentModel')

class CommentController {

  static createComment (req, res) {
    let data = {
      body: req.body.body,
      userId: req.decoded.id,
      questionId: req.params.id
    }

    let comment = new Comment(data)

    comment.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'creating comment success'
        })
      })
      .catch(err=> {
        res.status(500).json({
          status: 'failed',
          message: 'failed when creating comment'
        })
      })
  }

  static removeComment (req, res) {
    Comment.deleteOne({ _id: req.params.idComment, questionId:req.params.idQuestion, userId: req.decoded.id }, err => {
        if (!err) {
          res.status(200).json({
            status: 'success',
            message: 'deleting comment success'
          })
        } else {
          res.status(500).json({
            status: 'failed',
            message: 'deleting comment failed'
          })
        }
    })
  }
 
}

module.exports = CommentController