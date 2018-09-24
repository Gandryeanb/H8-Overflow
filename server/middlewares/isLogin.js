const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const isLogin = (req, res, next) => {

  if (req.headers.authorization) {
    
    let decoded = jwt.verify(req.headers.authorization, process.env.HASH_JWT)

    if (decoded.id) {
        User.find({ _id: decoded.id })
          .then(data => {
            if (data.length !== 0) {
              
              req.decoded = decoded
              next()

            } else {
              res.status(500).json({
                status: 'failed',
                message: 'You need to login first'
              })    
            }
          })
          .catch(err => {
            res.status(500).json({
              status: 'failed',
              message: 'Error when reading Auth'
            })      
          })
    } else {
      res.status(403).json({
        status: 'failed',
        message: 'You need to login first'
      })
    }

  } else {
      res.status(403).json({
        status: 'failed',
        message: 'You need to login first'
      })
  }

}

module.exports = isLogin