import { Game as MainGame } from './scenes/Game';
import { AUTO, Game, Scale,Types } from 'phaser';
import { Lobby } from './scenes/Lobby';
import { io } from 'socket.io-client';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Lobby,
        MainGame, 
    ]
};

export default new Game(config);

export enum ClientGameState {
    PLAYING = "Playing",
    LOBBY = "Lobby",
}

export const socket = io('http://localhost:3000');
