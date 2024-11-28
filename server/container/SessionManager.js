const {RoomStatus} = require("../model/Room");

class SessionManager {
    /**
     *
     * @param socket
     * @param {SocketRoomDatabase} service
     */
    constructor(socket,service) {
        this.socket = socket;
        this.service = service;

        this.tickHandlers = new Map();
    }
    /**
     *
     * @param {Room} room
     * @param {number} tps
     */
    startGame(room, tps?) {
        if(room.getStatus() === RoomStatus.WAITING) {
            throw new Error('the room has already been completed or has started');
        }
        if(tps > 1000) {
            throw new Error('the tps is too high!');
        }
        if(!this.service.roomExists(room.id)) {
            throw new Error('the room does not exist');
        }
        const tickHandler = setInterval(() => {
            this.socket.to(room.id).emit('tick',room);
        });

        this.tickHandlers.set(room.id, tickHandler);
        console.log(`Game loop started in room: ${room.name} at ${tps} TPS.`);
    }

    stopGame(room) {
        const tickHandler = this.tickHandlers.get(room.id);
        if(tickHandler) {
            clearInterval(tickHandler);
            this.tickHandlers.delete(room.id);
        } else {
            console.log('No active tickHandler was found');
        }
    }
}

module.exports = SessionManager;