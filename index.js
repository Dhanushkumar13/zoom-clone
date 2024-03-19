const express = require('express');

const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server)

const {v4: uuidv4} = require('uuid')

app.set('view engine','ejs')
app.use(express.static('public'))


app.get('/', (request,respone)=>{
    respone.redirect(`${uuidv4()}`)
})

app.get('/:room', (request,response)=>{
    response.render('room', {roomId: request.params.room})
})

io.on('connection', (socket) =>{
    socket.on('join-room', (roomId, userId) =>{
        socket.join(roomId)
        socket.to(roomId)
        socket.broadcast.emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.to(roomId)
            socket.broadcast.emit('disconnected', userId)
        })
    })
})
server.listen(3000, ()=>{
    console.log("Listening to PORT 3000")
})