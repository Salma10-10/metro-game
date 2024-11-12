import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import PauseScene from "./scenes/PauseScene";
import MainMenuScene from "./scenes/MainMenuScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene, PauseScene],
};

const game = new Phaser.Game(config);
