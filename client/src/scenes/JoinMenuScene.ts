import {Scene} from "phaser";
import {ClientGameState, socket} from "../main.ts";
import {ClientRoom} from "../container/ClientRoom.ts";

export class JoinMenuScene extends Scene {

    private clientRoomGroup: Phaser.GameObjects.Group;

    private listXOrigin: number = 100;

    private listYOrigin: number = 100;

    private listYGap: number = 100;

    constructor() {
        super(ClientGameState.ROOMS);
    }

    create() {
        socket.emit('getRooms', (rooms: ClientRoom[]) => {
            console.log(rooms);
            this.clientRoomGroup = this.add.group();
            for (let i = 0; i < rooms.length; i++) {
                const room: ClientRoom = rooms[i];
                let text = this.add.text(this.listXOrigin,this.listYOrigin + i * this.listYGap, `Room ${room.name}`);
                try {
                    this.clientRoomGroup.add(text);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
}

