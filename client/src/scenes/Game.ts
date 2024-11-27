import { Scene } from 'phaser';

import io from 'socket.io-client'
import { ClientGameState } from '../main';

const socket = io('http://localhost:3000');

socket.on('connect',() => {
    console.log('Connected to server');
    const roomName = 'r1';
    socket.emit('joinRoom',roomName);
});

export class Game extends Scene
{
    constructor ()
    {
        super(ClientGameState.PLAYING);
    }

    preload ()
    {
        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');
    }

    create ()
    {
        
        this.add.image(512, 384, 'background');
        this.add.image(512, 350, 'logo').setDepth(100);
        this.add.text(512, 490, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
    }
}
