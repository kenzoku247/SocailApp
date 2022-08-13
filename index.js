import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import SocketServer from './socketServer.js'
import { ExpressPeerServer } from 'peer'
import path from 'path'
import { createServer } from 'http'
import { Server } from 'socket.io'

import AdminRouter from './Routes/AdminRouter.js'
import AuthRouter from './Routes/AuthRouter.js'
import UserRouter from './Routes/UserRouter.js'
import PostRouter from './Routes/PostRouter.js'
import CommentRouter from './Routes/CommentRouter.js'
import NotifyRouter from './Routes/NotifyRouter.js'
import MessageRouter from './Routes/MessageRouter.js'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

dotenv.config()


// Socket
const HTTP = createServer(app)
const io =  new Server(HTTP,    {
    cors: {
      origin: 'https://kma-network.herokuapp.com',
    }
})

io.on('connection', (socket) => {
    SocketServer(socket);
    // console.log("a user connected with Id: " + socket.id);
})

// Create peer server
ExpressPeerServer(HTTP, { path: '/' })


// Routes
app.use('/admin', AdminRouter)
app.use('/api', AuthRouter)
app.use('/api', UserRouter)
app.use('/api', PostRouter)
app.use('/api', CommentRouter)
app.use('/api', NotifyRouter)
app.use('/api', MessageRouter)


const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    console.log(__dirname);
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000
HTTP.listen(port, () => {
    console.log('Server is running on port', port)
})