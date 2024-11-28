import {Scene} from "phaser";
import {resourcePath} from "../main.ts";

enum ClientMenuState {
    CREATING_ROOM = "creating_room",
    MAIN_MENU = "main_menu",
}

export class Menu extends Scene {

    private background: Phaser.GameObjects.Group;

    constructor() {
        super(ClientMenuState.MAIN_MENU);
    }

    preload() {
        this.load.setPath(resourcePath);
        this.load.image('background', 'flappy-bird-assets/sprites/background-day.png');
    }

    updateBackground(image: Phaser.GameObjects.Image) {
        const height = image.height;
        const scaleX = window.innerHeight / height;  // Scale factor for Y-axis (height)
        const width = image.width * scaleX;  // Scaled width of the background image
        const imageCount = Math.ceil(window.innerWidth / width);  // Number of background images needed

        // Adjust the number of background images based on the window size.
        let currentX = 0;

        // Hide any images that are no longer visible (off-screen) or too many
        for (let i = 0; i < this.background.children.size; i++) {
            const img  = this.background.getChildren()[i]; // Access image directly from the group
            if (i < imageCount) {
                img.setVisible(true);  // Make sure the image is visible
                img.setPosition(currentX, 0);
                img.setDisplaySize(width, window.innerHeight);
                currentX += width;
            } else {
                img.setVisible(false);  // Hide images that are no longer needed
            }
        }

        // If there aren't enough background images, create new ones
        for (let i = this.background.children.size; i < imageCount; i++) {
            const img = this.add.image(currentX, 0, 'background');
            img.setOrigin(0, 0);
            img.setDisplaySize(width, window.innerHeight);
            this.background.add(img);  // Add new background image to the group
            currentX += width;
        }
    }

    create() {
        this.background = this.add.group();
        const image = this.add.image(0, 0, 'background');
        this.updateBackground(image);

        this.scale.on('resize', () => {
            this.updateBackground(image);
        })
    }

    //
    // this.scale.on('resize', (gameSize: { width: number, height: number }) => {
    //
    //     const {width, height} = gameSize; // Destructure the width and height from the gameSize object
    //     if(this.backgroundImage.width > width && this.backgroundImage.height > height) {
    //         const img = this.add.image(0,0, 'background');
    //         img.setOrigin(0,0);
    //         img.setDisplaySize(width,height);
    //     }
    //     const newHeight = this.backgroundImage.height;
    //     const scaleFactor = height / newHeight;
    //     const newWidth = this.backgroundImage.width * scaleFactor;
    //
    //
    //     this.backgroundImage.setDisplaySize(newWidth, newHeight);
    //
    //     const numImages = Math.ceil(width / newWidth);
    //
    //     this.children.each((child) => {
    //         if (child !== this.backgroundImage) {
    //             child.destroy();
    //         }
    //     });
    //
    //     for (let i = 0; i < numImages; i++) {
    //         const img = this.add.image(newWidth * i, 0, 'background');
    //         img.setOrigin(0, 0);  // Set the origin to the top left so they align horizontally
    //         img.setDisplaySize(newWidth, height);  // Scale the image to match the height
    //     }
    // }, this);
}