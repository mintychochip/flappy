import {Game as MainGame} from './scenes/Game';
import {AUTO, Game, Types} from 'phaser';
import {io} from 'socket.io-client';
import {JoinMenuScene} from "./scenes/JoinMenuScene.ts";
import {Menu} from "./scenes/Menu.ts";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.RESIZE,  // Automatically resize the canvas when the window resizes
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Center the canvas in the window
    },
    scene: [
        Menu,
        MainGame,
        JoinMenuScene
    ]
};
export const socket = io('http://localhost:3000')
    .on('connect', () => {
        console.log('Connected to server');
    });

export default new Game(config);

export enum ClientGameState {
    PLAYING = "Playing",
    LOBBY = "Lobby",
    ROOMS = "Room",
}

export const resourcePath = 'assets';

export function getScaleFactor(scwidth: number, scheight: number): number {
    const width = castStringToNum(config.width);
    const height = castStringToNum(config.height);
    if (isNaN(width) || isNaN(height)) {
        throw new Error('Invalid width or height value');
    }
    const scaleX = scwidth / width;
    const scaleY = scheight / height;
    return Math.min(scaleX, scaleY);
}

function castStringToNum(num: number | string | undefined): number {
    if (typeof num == 'string') {
        const number = Number(num);
        if (!isNaN(number)) {
            return number;
        }
        return number;
    } else if (typeof num == 'number') {
        return num;
    }
    return NaN;
}