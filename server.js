import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend URL for production
        methods: ["GET", "POST"]
    }
});


const users = {}; // Track users and their socket IDs using the unique key

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.emit('socketid', socket.id);

    // Test Socket Connection
    socket.on('checking_socket', (data) => {
        console.log(`Checking socket from ${socket.id}:`, data);
        socket.emit('checking_socket_response', 'Response message or data here', data); // Send to sender only
    });

    // Chatting functionality
    socket.on('send_message', (data) => {
        const { receiverID, receiverType, senderID, senderType, userName, userImg, messageText, data_to_socket } = data;
        console.log(
            `Message from ${senderID} to ${receiverID}:`,
            `Type: ${receiverType} - ${senderType}`,
            `Text: ${messageText}`,
            `Name: ${userName}, Img: ${userImg}, Additional Data: ${data_to_socket}`
        );

        io.emit('receive_message', data); // Broadcast message to all clients, including sender
    });













    socket.on('join-room', ({ userType, loggerID }) => {
        const userKey = `${userType}-${loggerID}`;
        users[userKey] = socket.id;
        socket.broadcast.emit('user-joined', userKey);
        console.log(`User ${userKey} joined with socket ID ${socket.id}`);
    });

    socket.on('disconnect', () => {
        const userKey = Object.keys(users).find(key => users[key] === socket.id);
        if (userKey) {
            delete users[userKey];
            socket.broadcast.emit('user-left', userKey);
            console.log(`User ${userKey} disconnected`);
        }
    });

    socket.on('offer', ({ offer, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('offer', { offer, senderKey: socket.id });
        }
    });

    socket.on('answer', ({ answer, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('answer', { answer, senderKey: socket.id });
        }
    });

    socket.on('candidate', ({ candidate, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('candidate', { candidate, senderKey: socket.id });
        }
    });


    // Notify other users that a new user has joined
    // socket.on('join', (room) => {
    //     socket.join(room);
    //     socket.to(room).emit('user-joined', socket.id);
    //     console.log('Room & socketID: ', room, socket.id);
    // });

    // socket.on('signal', (data) => {
    //     socket.broadcast.emit('signal', {
    //         from: socket.id,
    //         signal: data.signal,
    //     });
    //     console.log('Signal & From SocketID: ', data.signal, socket.id);
    // });








    // Handle user disconnection
    // socket.on('disconnect', () => {
    //     console.log('A user disconnected:', socket.id);
    // });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
