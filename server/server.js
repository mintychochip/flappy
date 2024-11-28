const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const SocketRoomDatabase = require("./container/RoomDatabase.js");
const SessionManager = require("./container/SessionManager");

const DB_FILE_PATH = './rooms.db';

const roomDb = new SocketRoomDatabase(DB_FILE_PATH);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"], 
        credentials: true  
    }
});
app.use(express.static('public'));  


io.on('connection', (socket) => {
    console.log(`${ip}`);
    console.log('A player connected:', socket.id);

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on('createRoom', async (roomName, callback) => {
        try {
            const inserted = await roomDb.createRoom(roomName);
            if(inserted) {
                callback({success: inserted, message: `Room ${roomName} has been created.`});
            } else {
                callback({success:false, message: 'Failed to create the room'});
            }
        } catch (err) {
            callback({success: false, exception: err});
        }
    });

    socket.on('getRooms', async(callback) => {
        try {
            const rooms = await roomDb.getAllRooms();
            callback(rooms);
        } catch (err) {
            console.log(err);
        }
    });


    socket.on('startGame', async(roomName, callback) => {
        try {
            let manager = new SessionManager(socket,roomDb);
            manager.startGame(roomName);
        } catch (err) {

        }
    });
});


server.listen(3000, () => {
    console.log('Server running on http:');
});
