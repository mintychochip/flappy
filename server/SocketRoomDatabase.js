const sqlite3 = require("sqlite3").verbose();

// SQL Queries
const ROOM_EXISTS = "SELECT EXISTS(SELECT 1 FROM rooms WHERE id=? LIMIT 1)";
const ROOM_GET_BY_ID = "SELECT room_name,timestamp FROM rooms WHERE id=? LIMIT 1";
const ROOM_GET_BY_NAME = "SELECT id,timestamp FROM rooms WHERE room_name=? LIMIT 1";
const ROOM_GET_ALL = "SELECT * FROM rooms";
const ROOM_INSERT = "INSERT INTO rooms(room_name,timestamp) VALUES (?,?)";

class SocketRoomDatabase {
    db;

    constructor(filePath) {
        this.db = new sqlite3.Database(filePath);
        this.db.serialize(() => {
            this.db
                .run(`PRAGMA foreign_keys=ON;`)
                .run(`
          CREATE TABLE IF NOT EXISTS rooms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_name TEXT UNIQUE NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `)
                .run(`
          CREATE TABLE IF NOT EXISTS users(
            user_id TEXT NOT NULL,
            room_id INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
          );
        `);
        });
    }

    // Check if a room exists by its ID
    roomExists(room_id) {
        return new Promise((resolve, reject) => {
            this.db.get(ROOM_EXISTS, [room_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['EXISTS'] === 1);
                }
            });
        });
    }

    // Get a room's name and timestamp by its ID
    getRoomById(room_id) {
        return new Promise((resolve, reject) => {
            this.db.get(ROOM_GET_BY_ID, [room_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null); // Return null if no room is found
                }
            });
        });
    }

    // Get a room's ID and timestamp by its name
    getRoomByName(room_name) {
        return new Promise((resolve, reject) => {
            this.db.get(ROOM_GET_BY_NAME, [room_name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || null); // Return null if no room is found
                }
            });
        });
    }

    // Get all rooms
    getAllRooms() {
        return new Promise((resolve, reject) => {
            this.db.all(ROOM_GET_ALL, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows); // Return an array of rooms
                }
            });
        });
    }

    // Insert a new room with a given name and timestamp
    insertRoom(room_name) {
        return new Promise((resolve, reject) => {
            const timestamp = new Date().toISOString(); // Use current timestamp
            this.db.run(ROOM_INSERT, [room_name, timestamp], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID); // Return the last inserted row ID (room ID)
                }
            });
        });
    }
}

module.exports = SocketRoomDatabase;
