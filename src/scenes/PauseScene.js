export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: "PauseScene" });
  }

  create() {
    // Add background
    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.5);

    this.add
      .text(400, 200, "Paused", {
        fontSize: "64px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    // Add "Resume" button text
    const resumeButton = this.add
      .text(400, 400, "Resume", {
        fontSize: "32px",
        fill: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    // Change button text color on hover
    resumeButton.on("pointerover", () => {
      resumeButton.setStyle({ fill: "#ff0" });
    });

    // Revert button text color when not hovered
    resumeButton.on("pointerout", () => {
      resumeButton.setStyle({ fill: "#ffffff" });
    });

    // Resume the game and stop the pause scene when the button is clicked
    resumeButton.on("pointerdown", () => {
      this.scene.resume("GameScene");
      this.scene.stop();
    });
  }
}
