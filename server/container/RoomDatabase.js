const Room = require("../model/Room");
const sqlite3 = require("sqlite3").verbose();
const ROOM_EXISTS_BY_NAME = "SELECT EXISTS (SELECT 1 FROM rooms WHERE name=? LIMIT 1)";
const ROOM_EXISTS_BY_ID = "SELECT EXISTS(SELECT 1 FROM rooms WHERE id=? LIMIT 1)";
const ROOM_GET_BY_ID = "SELECT name,status,timestamp FROM rooms WHERE id=? LIMIT 1";
const ROOM_GET_BY_NAME = "SELECT id,status,timestamp FROM rooms WHERE name=? LIMIT 1";
const ROOM_GET_ALL = "SELECT * FROM rooms";
const ROOM_UPDATE_STATUS_BY_ID = "UPDATE rooms SET status=? WHERE id=?";
const ROOM_UPDATE_STATUS_BY_NAME = "UPDATE rooms SET status=? WHERE name=?";
const ROOM_INSERT = "INSERT INTO rooms(name,timestamp) VALUES (?,?)";
const ROOM_DELETE = "DELETE FROM rooms WHERE name=? LIMIT 1";


class RoomDatabase {
    db;

    constructor(filePath) {
        this.db = new sqlite3.Database(filePath);
        this.db.serialize(() => {
            this.db.run(`PRAGMA foreign_keys=ON;`)
                .run(`
          CREATE TABLE IF NOT EXISTS rooms(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'waiting',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `)
                .run(`
          CREATE TABLE IF NOT EXISTS users(
            id TEXT NOT NULL,
            room_id INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
          );
        `);
        });
    }


    roomExists(room_id) {
        return new Promise((resolve, reject) => {
            this.db.get(ROOM_EXISTS_BY_ID, [room_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['EXISTS'] === 1);
                }
            });
        });
    }

    roomExists(room_name) {
        return new Promise((resolve, reject) => {
            this.db.get(ROOM_EXISTS_BY_NAME, [room_name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row['EXISTS'] === 1);
                }
            })
        })
    }

    /**
     *
     * @param {number} room_id
     * @returns {Room}
     */
    getRoomById(room_id) {
        this.db.get(ROOM_GET_BY_ID, [room_id], (err, row) => {
            if (err) {
                throw err;
            } else {
                return (row || null);
            }
        });
    }

    /**
     *
     * @param {string} room_name
     * @returns {Room}
     */
    getRoomByName(room_name) {
        this.db.get(ROOM_GET_BY_NAME, [room_name], (err, row) => {
            if (err) {
                throw err;
            } else {
                return (row || null);
            }
        });
    }


    /**
     *
     * @returns {Promise<Room[]>}
     */
    getAllRooms() {
        return new Promise((resolve, reject) => {
            this.db.all(ROOM_GET_ALL, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const rooms = rows.map((row) => {
                        return new Room(row.id, row.name, row.timestamp);
                    });
                    resolve(rooms);
                }
            });
        });
    }


    /**
     *
     * @param {string} room_name
     * @returns {Promise<unknown>}
     */
    createRoom(room_name) {
        return new Promise((resolve, reject) => {
            const timestamp = new Date().toISOString();
            this.db.run(ROOM_INSERT, [room_name, timestamp], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }
}

module.exports = RoomDatabase;
