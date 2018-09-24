const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
  fname: {
    type: String,
    required: [true, 'Firstname required']
  },
  lname: String,
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true
  },
  password: { 
    type: String,
    required: [true, 'Password required'],
    minlength: [6, 'Password length must be 6 or more']
  },
  loginWeb: {
    type: Number,
    default: 1
  },
  loginFB: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

userSchema.post('validate', (doc) => {
  const salt = bcrypt.genSaltSync(Number(process.env.HASH_SALT))
  const hash = bcrypt.hashSync(doc.password, salt)
  
  doc.password = hash
})

const User = mongoose.model('User', userSchema)

module.exports = User