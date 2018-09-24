const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title required']
  },
  description: {
    type: String,
    required: [true, 'description required']
  },
  solved: {
    type: Boolean,
    default: false
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  upvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvote: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  answer:[{ type: Schema.Types.ObjectId, ref: 'Answer' }]
}, {
  timestamps: true
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question