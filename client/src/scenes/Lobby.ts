import { Scene } from "phaser";
import { ClientGameState, socket } from "../main";

export class Lobby extends Scene {
  constructor() {
    super(ClientGameState.LOBBY);
  }

  create() {
    const clickButton = this.add.text(100,200,'Create Room.ts');
    clickButton.setInteractive();
    clickButton.on('pointerdown',() => {
        console.log('Attempting to create a room');
        const roomName = "test";
        socket.emit('createRoom',roomName, (response: any) => {
            console.log(response);
        });
    });

    const joinRoomButton = this.add.text(300,200,'Join A Room.ts');
    joinRoomButton.setInteractive();
    joinRoomButton.on('pointerdown',() => {
        this.scene.switch(ClientGameState.ROOMS);
    });
  }
}
