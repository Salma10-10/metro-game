export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  preload() {
    // Load any assets needed for the main menu
    this.load.image("background", "/background.png");
  }

  create() {
    // Add the background
    this.add.image(400, 300, "background").setOrigin(0.5, 0.5);

    // Add title text
    this.add
      .text(400, 200, "Meteor Rush", {
        fontSize: "64px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    // Add start button
    const startButton = this.add
      .text(400, 400, "Start Game", {
        fontSize: "32px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5, 0.5);

    // Make the start button interactive
    startButton.setInteractive();

    // Add hover effect
    startButton.on("pointerover", () => {
      startButton.setStyle({ fill: "#ff0" });
    });

    startButton.on("pointerout", () => {
      startButton.setStyle({ fill: "#ffffff" });
    });

    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
  }
}
