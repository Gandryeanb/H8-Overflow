const Question = require('../models/questionModel')

class QuestionController {

  static findOne (req, res) {
    Question.find({ _id: req.params.id })
      .populate('userId', 'fname')
      .populate({ path: 'answer', populate: { path: 'userId' } })
      .then(data => {
        if (data.length !== 0) {
          res.status(200).json({
            status: 'success',
            data: data[0]
          })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'question not found'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'error when finding question'
        })
      })
  }

  static createQuestion (req, res) {
    let data = {
      title: req.body.title,
      description: req.body.description,
      userId: req.decoded.id
    }

    let question = new Question(data)

    question.save()
      .then(data => {
        res.status(201).json({
          status: 'success',
          message: 'Creating question success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static removeQuestion (req, res) {
    Question.deleteOne({
        _id: req.params.id,
        userId: req.decoded.id
    })
      .then(data => {
        res.status(200).json({
          status: 'success',
          message: 'success when deleting question'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when deleting question'
        })
      })
  }

  static updateQuestion (req, res) {
    let data = {
      title: req.body.title,
      description: req.body.description
    }
    Question.update({ _id: req.params.id, userId: req.decoded.id }, data, (err, result) => {
      if (!err) {
        res.status(201).json({
          status: 'success',
          message: 'updating data is success',
          data: result
        })
      } else {
        res.status(500).json({
          status: 'failed',
          message: 'updating data is failed'
        })
      }
    })
  }

  static findAllQuestion (req, res) {
    Question.find()
      .populate('userId', 'fname')
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: data
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when get all data questions'
        })
      })
  }

  static solveQuestion (req, res) {
    console.log('masuk method')
    Question.updateOne ({ _id: req.params.id, userId: req.decoded.id }, { solved: true }, err => {
      if (!err) {
        res.status(201).json({
          status: 'success',
          message: 'success when updating solved question'
        })
      } else {
        res.status(500).json({
          status: 'success',
          message : 'failed when updating solve question (internal errors)'
        })
      }
    }) 
  }

  static createUpvote (req, res) {    
    Question.find({ _id: req.params.id })
      .then(data => {
        let isAllowedToVote = true
        if (data[0].upvote.indexOf(req.decoded.id) !== -1) {
          isAllowedToVote = false
        }
        if (isAllowedToVote && data[0].userId != req.decoded.id) {
          Question.updateOne({ _id: data[0]._id }, { $push: { upvote: req.decoded.id } }, (err, result) => {
            if (!err) {
              if (result.n === 1) {
                Question.updateOne({ _id: data[0]._id }, { $pull: { downvote: req.decoded.id } }, (err, result) => {
                  if (!err) {
                    res.status(201).json({
                      status: 'success',
                      message: 'success upvoting and deleting downvote question'
                    })
                  } else {
                    res.status(500).json({
                      status: 'failed',
                      message: 'failed upvoting deleting downvote question'
                    })
                  }
                })
              } else {
                res.status(404).json({
                  status: 'failed',
                  message: 'failed add upvoting question'
                })  
              }
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'failed when update upvoting question',
                err: err.message
              })
            }
          })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you are not allowed to vote this question'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when finding question'
        })
      }) 
  }

  static createDownvote (req, res) {    
    Question.find({ _id: req.params.id })
      .then(data => {
        let isAllowedToVote = true
        if (data[0].downvote.indexOf(req.decoded.id) !== -1) {
          isAllowedToVote = false
        }
        if (isAllowedToVote && data[0].userId != req.decoded.id) {
          Question.updateOne({ _id: data[0]._id }, { $push: { downvote: req.decoded.id } }, (err, result) => {
            if (!err) {
              if (result.n === 1) {
                Question.updateOne({ _id: data[0]._id }, { $pull: { upvote: req.decoded.id } }, (err, result) => {
                  if (!err) {
                    res.status(201).json({
                      status: 'success',
                      message: 'success upvoting and deleting downvote question'
                    })
                  } else {
                    res.status(500).json({
                      status: 'failed',
                      message: 'failed upvoting deleting downvote question'
                    })
                  }
                })
              } else {
                res.status(404).json({
                  status: 'failed',
                  message: 'failed add upvoting question'
                })  
              }
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'failed when update upvoting question',
                err: err.message
              })
            }
          })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you are not allowed to vote this question'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when finding question'
        })
      }) 
  }

  static keyUp (req, res) {
    Question.find({ title : { $regex: `${req.params.title}`, $options: 'i'}})
      .populate('userId', 'fname')
      .populate({ path: 'answer', populate: { path: 'userId' } })
      .then(data => {
        res.status(200).json({
          status: 'success',  
          data: data
        })
      })
      .catch(err => {
        res.status(500),json({
          status: 'failed', 
          message: `error when finding data`
        })
    } )
  }

}

module.exports = QuestionController