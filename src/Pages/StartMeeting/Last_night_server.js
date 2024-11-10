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












    const users = {}; // Track users and their socket IDs using the unique key

    socket.on('join-room', (uniqueKey) => {
        users[uniqueKey] = socket.id; // Save the unique key with their socket
        socket.broadcast.emit('user-joined', uniqueKey); // Notify others about the new user
        socket.emit('existing-users', Object.keys(users)); // Send existing users to the new user
        console.log(`User ${uniqueKey} joined with socket ID ${socket.id}`);
    });
    
    socket.on('disconnect', () => {
        const userKey = Object.keys(users).find(key => users[key] === socket.id);
        if (userKey) {
            delete users[userKey]; // Remove user on disconnect
            socket.broadcast.emit('user-left', userKey); // Notify others
            console.log(`User ${userKey} disconnected`);
        }
    });
    
    socket.on('offer', ({ offer, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('offer', { offer, from: socket.id });
            console.log('offer: ', offer, socket.id);
        } else {
            console.error(`User ${to} not found for offer.`);
        }
    });


    socket.on('answer', ({ answer, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('answer', { answer, from: socket.id });
            console.log('answer', { answer, from: socket.id });
        } else {
            console.error(`User ${to} not found for answer.`);
        }
    });



    
    
    // Server-side handler for 'request-offer' event
    socket.on('request-offer', (newUniqueKey) => {
        const offer = {}; // Create the offer here
        if (users[newUniqueKey]) {
            socket.to(users[newUniqueKey]).emit('offer', { offer, from: socket.id });
        } else {
            console.error(`User ${newUniqueKey} not found for offer.`);
        }
    });
    

    
    socket.on('candidate', ({ candidate, to }) => {
        if (users[to]) {
            socket.to(users[to]).emit('candidate', { candidate, from: socket.id });
        } else {
            console.error(`User ${to} not found for candidate.`);
        }
        console.log('candidate', { candidate, from: socket.id, to, users });
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
