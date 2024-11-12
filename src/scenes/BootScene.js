import Phaser from "phaser";

class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {}

  create() {
    // Start the main menu scene
    this.scene.start("MainMenuScene");
  }
}

export default BootScene;
