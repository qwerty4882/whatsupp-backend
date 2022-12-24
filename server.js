const express = require('express')
require('express-async-errors')
const connectDB = require('./dbconnectiion/index')
const authRouter = require('./routes/authRouter')
const messageRouter = require('./routes/messagesRouter')
const searchRouter = require('./routes/usersearch')
const authenticateUser = require('./middleware/authentication')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
app.use(
  cors({
    origin: '*',
  })
)

const notFoundMiddleware = require('./middleware/notfound')
const errorHandlerMiddlewarec = require('./middleware/errors')
const DB_CONNECTION_URL = process.env.API_KEY
const PORT = 3333

// socket
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
})
io.sockets.on('connection', function (socket) {
  socket.on('join', ({ name }) => {
    socket.join(name)
  })
  socket.on('sendmsg', (data, name) => {
    socket.to(name).emit('receive-msg', data)
  })
  // console.log('connected')
})

// io.sockets.on('sendmsg', (data) => {
//   console.log(data.msg)
// })
app.use(express.json())

//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/chats', authenticateUser, messageRouter)
app.use('/api/v1/users', authenticateUser, searchRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddlewarec)

const startServer = async () => {
  try {
    await connectDB(DB_CONNECTION_URL)
    server.listen(PORT, console.log(`server is lesting at port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}
startServer()
