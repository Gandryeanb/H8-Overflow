const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')

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
	  if (err.message.indexOf('E11000 duplicate key error collection') !== -1) {
      err.message = 'Email already exist'
	  } else {
	    let message = err.message.slice(23)
	    let arrMessage = message.split(',')
	    let fixMessage = arrMessage[0].split(':')[1]
	    err.message = fixMessage
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
            message: 'Email and Password is wrong'
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

  static loginFacebook (req, res) {
    let self = this
    let url = `https://graph.facebook.com/me?fields=id,name,email&access_token=${req.headers.token}`
    axios({
      url: url,
      method: 'get'
    })
      .then(response => {
        User.find({ email: response.data.email })
          .then(data => {
            if (data.length != 0) {
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
              const salt = bcrypt.genSaltSync(Number(process.env.HASH_SALT))
              const hash = bcrypt.hashSync(response.data.email + response.data.id, salt)
              let newUser = {
                fname: response.data.name,
                email: response.data.email,
                password: hash,
                loginWeb: 0,
                loginFB: 1
              }
              let user = new User(newUser)
              user.save()
                .then(newUser => {
                  let authorization = jwt.sign({
                    id: data[0]._id,
                    fname: data[0].fname,
                    email: data[0].email
                  }, process.env.HASH_JWT)
              
                  res.status(200).json({
                    status: 'success',
                    authorization: authorization
                  })
                })
                .catch(err => { 
                  res.status(500).json({
                    status: 'failed',
                    message: err.message
                  })
                })
            }
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: 'failed when finding user (internal error)',
              errMessage: err.message
            })
          })
      })
      .catch(resonse => {
        res.status(500).json({
          status: 'failed',
          message: 'failed when loggin user'
        })
      })
  }

  static tokenSender(req, res, data) {
    
    
  }

}

module.exports = UserController
