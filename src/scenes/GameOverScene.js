export default class GameOverScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameOverScene' });
    }
  
    init(data) {
      this.finalScore = data.score;
    }
  
    create() {
      this.add.text(400, 300, `Game Over\nScore: ${this.finalScore}`, {
        fontSize: '32px',
        fill: '#ffffff',
      }).setOrigin(0.5);
  
      this.input.once('pointerdown', () => {
        this.scene.start('GameScene');
      });
    }
  }
  