import { Scene } from "phaser";
import { ClientGameState, socket } from "../main";

export class Lobby extends Scene {
  constructor() {
    super(ClientGameState.LOBBY);
  }

  create() {
    const clickButton = this.add.text(100,200,'Create Room');
    clickButton.setInteractive();
    clickButton.on('pointerdown',() => {
        console.log('Attempting to create a room');
        const roomName = "test";
        socket.emit('createRoom',roomName, (response: any) => {
            console.log(response);
        });
    });
  }
}
