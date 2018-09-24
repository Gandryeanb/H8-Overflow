const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController {

  static register (req, res) {
    let data = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password
    }

    let user = new User(data)

    user.save()
      .then(response => {
        res.status(201).json({
            status: 'success',
            message: 'creating account is success'
        })
      })
      .catch(err => {
        if (err.message == 'E11000 duplicate key error collection: overflow_dev.users index: email_1 dup key: { : \"andri@mail.com\" }') {
            err.message = 'Email already exist'
        } else if (err.message == 'User validation failed: password: Password length must be 6 or more') {
            err.message = 'Password length must be 6 or more'
        }
        res.status(500).json({  
          status: 'failed',
          message: err.message
        })
      })
  }

  static login (req, res) {
    User.find( {email: req.body.email} )
      .then(data => {
        if (data.length !== 0) {
          if (bcrypt.compareSync(req.body.password, data[0].password)) {
            let authorization = jwt.sign({
              id: data[0]._id,
              fname: data[0].fname,
              email: data[0].email
            }, process.env.HASH_JWT)

            res.status(200).json({
              status: 'success',
              authorization: authorization
            })
          } else {
            res.status(403).json({
              status: 'failed',
              message: 'Email and Password is wrong'
            })    
          }
        } else {
          res.status(403).json({
            status: 'failed',
            message: 'You need to register first'
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: 'Error when loging in'
        })
      })
  }

  static userData (req, res) {
      res.status(200).json({
        status: 'success',
        data: {
          id: req.decoded.id,
          fname: req.decoded.fname,
          email: req.decoded.email
        }
      })
  }

}

module.exports = UserController