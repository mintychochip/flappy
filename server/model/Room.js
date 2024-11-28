const RoomStatus = {
    WAITING: 0,
    STARTED: 1,
    STOPPED: 2
}
const RoomStatusReversed = Object.fromEntries(
    Object.entries(RoomStatus).map(([key, value]) => [value, key])
);

class Room {
    /**
     *
     * @param {number} id
     * @param {string} name
     * @param {number} status
     * @param {number} timestamp
     */
    constructor(id?, name, status = RoomStatus.WAITING, timestamp) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.timestamp = timestamp;
    }

    /**
     *
     * @returns {RoomStatus}
     */
    getStatus() {
        return RoomStatusReversed[this.status] || "NaN";
    }
}

module.exports = {Room, RoomStatus};
