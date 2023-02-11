const express = require('express');
const app = express();
// const http = require('http').Server(app);
const http = require('http');
const PORT = 4000;
const cors = require('cors');

app.use(cors());

const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const users = {};

io.on('connection', socket => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', users[socket.id]);
    });

})

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });