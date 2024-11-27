const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const SocketRoomDatabase = require("./SocketRoomDatabase.js");

const DB_FILE_PATH = './rooms.db';

const roomDb = new SocketRoomDatabase(DB_FILE_PATH);
// Create an Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8082",  // Allow the client from port 8081
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"], // Optional: specify allowed headers
        credentials: true  // Optional: if you're using cookies or credentials
    }
});

// Serve static files (HTML, JS)
app.use(express.static('public'));  // Ensure you're serving the right folder

// Handle WebSocket events
io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on('createRoom', async (roomName, callback) => {
        try {
            const exists = await roomDb.roomExists(roomName);
            if (exists) {
                callback({success: false, message: 'The room already exists'});
            } else {
                await roomDb.insertRoom(roomName);
                socket.join(roomName);
                callback({success: true, message: 'Room was created'});
            }
        } catch (err) {
            console.error(err);
            callback({success: false, exception: err});
        }
    })
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
