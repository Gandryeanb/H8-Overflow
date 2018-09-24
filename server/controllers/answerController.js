const Answer = require('../models/answerModel')
const Question = require('../models/questionModel')

class AnswerController {

  static createAnswer (req, res) {
    Question.find({ _id: req.params.id })
      .then(data => {
        if (data.length === 1 && data[0].userId != req.decoded.id) {
          let data = {
            description: req.body.description,
            userId: req.decoded.id,
            questionId: req.params.id
          }
          let answer = new Answer(data)
          answer.save()
            .then(data => {
              res.status(201).json({
                status: 'success',
                message: 'success creating answer'
              })
            })
            .catch(err => {
              res.status(500).json({
                status: 'failed',
                message: 'failed when creating answer'
              })
            })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you can`t do this actions or question not found'
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

  static updateAnswer (req, res) {
    Answer.updateOne({
      _id: req.params.id,
      userId: req.decoded.id
    }, { description: req.body.description }, (err, result) => {
      if (!err) {
        res.status(201).json({
          status: 'success',
          message: 'updating answer is success'
        })
      } else {
        res.status(500).json({
          status: 'failed',
          message: 'updating answer is failed'
        })
      }
    })
  }

  static createUpvote (req, res) {
    Answer.find({ _id: req.params.id })
      .then(data => {
        let isAllowedToVote = true
        if (data[0].upvote.indexOf(req.decoded.id) !== -1) {
          isAllowedToVote = false
        }
        if (isAllowedToVote && data[0].userId != req.decoded.id) {
          Answer.updateOne({ _id: data[0]._id }, { $push: { upvote: req.decoded.id } }, (err, result) => {
            if (!err) {
              if (result.n === 1) {
                Answer.updateOne({ _id: data[0]._id }, { $pull: { downvote: req.decoded.id } }, (err, result) => {
                  if (!err) {
                    res.status(201).json({
                      status: 'success',
                      message: 'success upvoting and deleting downvote answer'
                    })
                  } else {
                    res.status(500).json({
                      status: 'failed',
                      message: 'failed upvoting deleting downvote answer'
                    })
                  }
                })
              } else {
                res.status(404).json({
                  status: 'failed',
                  message: 'failed add upvoting answer'
                })  
              }
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'failed when update upvoting answer',
                err: err.message
              })
            }
          })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you are not allowed to vote this answer'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when finding answer'
        })
      }) 
  }

  static createDownvote (req, res) {    
    Answer.find({ _id: req.params.id })
      .then(data => {
        let isAllowedToVote = true
        if (data[0].downvote.indexOf(req.decoded.id) !== -1) {
          isAllowedToVote = false
        }
        if (isAllowedToVote && data[0].userId != req.decoded.id) {
          Answer.updateOne({ _id: data[0]._id }, { $push: { downvote: req.decoded.id } }, (err, result) => {
            if (!err) {
              if (result.n === 1) {
                Answer.updateOne({ _id: data[0]._id }, { $pull: { upvote: req.decoded.id } }, (err, result) => {
                  if (!err) {
                    res.status(201).json({
                      status: 'success',
                      message: 'success upvoting and deleting downvote answer'
                    })
                  } else {
                    res.status(500).json({
                      status: 'failed',
                      message: 'failed upvoting deleting downvote answer'
                    })
                  }
                })
              } else {
                res.status(404).json({
                  status: 'failed',
                  message: 'failed add upvoting answer'
                })  
              }
            } else {
              res.status(500).json({
                status: 'failed',
                message: 'failed when update upvoting answer',
                err: err.message
              })
            }
          })
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'you are not allowed to vote this answer'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when finding answer'
        })
      }) 
  }

}

module.exports = AnswerController