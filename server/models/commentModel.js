const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  body: {
    type: String,
    required: [true, 'comment required']
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' }
},{
  timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment