require('dotenv').config()
const app = require('./src/app');
const http = require('http')

const server = http.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

global._io = io

const PORT = process.env.PORT || 4000;

server.listen(PORT, ()=>{
    console.log('server is running on port 4000')
})