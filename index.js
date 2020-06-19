const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

// Import router
const authRouter = require('./routes/Auth')
const postRouter = require('./routes/Post')

dotenv.config()

// Connect with MongoDB Atlas
const uri = process.env.DB_CONNECT;
mongoose.connect(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
const conn = mongoose.connection
// Test the connect with database
conn.on('error', err => {
   console.log(err)
})
 
conn.once('open', () => {
   console.log('Connection successful')
})

// Middleware
app.use(express.json())

// Route Middleware
app.use('/api/user', authRouter)
app.use('/api/posts', postRouter)

app.listen(3000, () => console.log('Server is up & running'))