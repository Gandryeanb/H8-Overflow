require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PROD_PORT || process.env.DEV_PORT
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/overflow_dev', { useNewUrlParser:true })
mongoose.set('useCreateIndex', true)
const db = mongoose.connection;
const cors = require('cors')

const userRoute = require ('./routes/userRoute')
const questionRoute = require ('./routes/questionRoute')
const commentRoute = require ('./routes/commentRoute')
const answerRoute = require('./routes/answerRoute')

app.use (cors())
app.use (express.json())
app.use (express.urlencoded({ extended:false }))

app.use ('/users', userRoute)
app.use ('/questions', questionRoute)
app.use ('/comment', commentRoute)
app.use ('/answers', answerRoute)

app.get ('/', (req, res) => {
  res.status(200).json({
    message: 'Server ON'
  })
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`> DB CONNECTED`)
});

app.listen(port, () => {
  console.log(`\n> LISTENING TO PORT ${port}`)
})