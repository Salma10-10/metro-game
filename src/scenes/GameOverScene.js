export default class GameOverScene extends Phaser.Scene {
  constructor() {
      super({ key: 'GameOverScene' });
  }

  init(data) {
      this.finalScore = data.score;
  }

  create() {
      // Display the game-over image
      this.add.image(400, 300, 'gameOver').setOrigin(0.5, 0.5); // Adjust position if needed

      // Display the final score below the game-over image
      this.add.text(400, 200, `Score: ${this.finalScore}`, {
          fontFamily: '"Press Start 2P", cursive',
          fontSize: '32px',
          fill: '#FDFD96'
      }).setOrigin(0.5);

      // Add prompt to restart game
      this.add.text(400, 560, 'Click to Restart', {
        fontFamily: '"Press Start 2P", cursive',
          fontSize: '24px',
          fill: '#FDFD96'
      }).setOrigin(0.5);

      // Restart game on mouse click
      this.input.once('pointerdown', () => {
          this.scene.start('GameScene');
      });
  }
}
