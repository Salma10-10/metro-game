import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load assets from the public folder
    this.load.image('viteLogo', '/vite.svg'); // Using the SVG from public folder
  }

  create() {
    // Add the loaded image to the game scene (centered on the screen)
    this.add.image(400, 300, 'viteLogo').setScale(0.5); // Scaling it down since SVG might be large
    // Start the next scene (e.g., GameScene)
    this.scene.start('GameScene');
  }
}

export default BootScene;
