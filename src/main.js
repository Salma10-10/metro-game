import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [BootScene, GameScene, GameOverScene], // Make sure your scenes are imported and used here
};

const game = new Phaser.Game(config);
