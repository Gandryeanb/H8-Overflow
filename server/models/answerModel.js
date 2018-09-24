const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./questionModel')

const answerSchema = new Schema({
  description: {
    type: String,
    required: [true, 'description required']
  },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
})

answerSchema.post('save', doc => {
  Question.updateOne({ _id: doc.questionId }, { $push: { answer: doc._id } }, err => {
    if(!err) {
      
    }
  })
})

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer