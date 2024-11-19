export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.player;
    this.meteors;
    this.energyOrbs;
    this.shieldPowerUps;
    this.cursors;
    this.score = 0;
    this.shields = 0;
    this.speedBoosts = 0;
    this.scoreText;
    this.backgroundMusic;
    this.isMovingSideways = false;
    this.isShieldActive = false;
    this.shieldGraphics;
  }

  preload() {
    // Load assets (images, sprites, and sounds)
    this.load.image("background", "/background.png");
    this.load.image("gameOver", "/gameover.png");
    this.load.image("meteor", "/meteor.png");
    this.load.image("energyOrb", "/energyOrb.png");
    this.load.image("shieldPowerUp", "/shieldPowerUp.png");
    this.load.spritesheet("spaceship", "/spaceship.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    // Load audio files
    this.load.audio("backgroundMusic", "/backgroundMusic.mp3");
    this.load.audio("collectOrb", "/collectOrb.mp3");
    this.load.audio("meteorHit", "/meteorHit.mp3");
    this.load.audio("woosh", "/woosh.mp3");
    console.log("Assets loaded");
  }

  create() {
    // Add the background
    this.add.image(400, 300, "background").setOrigin(0.5, 0.5);

    // Create player spaceship
    this.player = this.physics.add.sprite(375, 500, "spaceship");
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // Create shield effect graphics
    this.shieldGraphics = this.add.graphics();
    this.shieldGraphics.lineStyle(2, 0x0000ff, 1);
    this.shieldGraphics.strokeCircle(0, 0, 40);
    this.shieldGraphics.setVisible(false);

    // Create groups for meteors, energy orbs, and shield power-ups
    this.meteors = this.physics.add.group();
    this.energyOrbs = this.physics.add.group();
    this.shieldPowerUps = this.physics.add.group();

    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.P
    );
    this.escKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    // Initialize the score text
    this.scoreText = this.add.text(16, 16, "Score:0", {
      fontSize: "32px",
      fill: "#FDFD96",
    });

    // Play background music (looping)
    this.backgroundMusic = this.sound.add("backgroundMusic");
    this.backgroundMusic.play({
      loop: true,
      volume: 0.2,
    });

    // Woosh sound
    this.wooshSound = this.sound.add("woosh", { volume: 0.5 });

    // Spawn meteors, energy orbs, and shield power-ups
    this.time.addEvent({
      delay: 1000,
      callback: this.spawnMeteor,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.spawnEnergyOrb,
      callbackScope: this,
      loop: true,
    });

    this.time.addEvent({
      delay: 10000,
      callback: this.spawnShieldPowerUp,
      callbackScope: this,
      loop: true,
    });

    // Set up collisions
    this.physics.add.overlap(
      this.player,
      this.meteors,
      this.handlePlayerHit,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.energyOrbs,
      this.collectEnergyOrb,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.shieldPowerUps,
      this.collectShieldPowerUp,
      null,
      this
    );

    // Create player animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("spaceship", {
        start: 4,
        end: 2,
      }),
      frameRate: 5,
      repeat: 0,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "spaceship", frame: 4 }],
      frameRate: 2,
      repeat: 0,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("spaceship", {
        start: 4,
        end: 6,
      }),
      frameRate: 5,
      repeat: 0,
    });

    // Increase difficulty after 10 seconds
    this.time.delayedCall(10000, this.increaseDifficulty, [], this);

    // Increase difficulty every time the score reaches a multiple of 100
    this.events.on("scoreChanged", (newScore) => {
      if (newScore % 100 === 0) {
        this.increaseDifficulty();
      }
    });
  }

  update() {
    // Check for pause key press
    if (
      Phaser.Input.Keyboard.JustDown(this.pauseKey) ||
      Phaser.Input.Keyboard.JustDown(this.escKey)
    ) {
      this.scene.pause();
      this.scene.launch("PauseScene");
    }

    // Movement logic
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      if (!this.isMovingSideways) {
        this.isMovingSideways = true;
      }
      if (this.player.anims.currentAnim.key !== "left") {
        this.player.anims.play("left");
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      if (!this.isMovingSideways) {
        this.isMovingSideways = true;
      }
      if (this.player.anims.currentAnim.key !== "right") {
        this.player.anims.play("right");
      }
    } else {
      this.player.setVelocityX(0);
      if (this.isMovingSideways) {
        this.isMovingSideways = false;
      }
      this.player.anims.play("turn", true);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
    } else {
      this.player.setVelocityY(0);
    }

    // Update shield graphics position
    if (this.isShieldActive) {
      this.shieldGraphics.setPosition(this.player.x, this.player.y);
    }
  }

  // Stop background music when the scene is stopped or changed
  stopBackgroundMusic() {
    if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
      this.backgroundMusic.stop();
    }
  }

  // Spawn meteor at random positions
  spawnMeteor() {
    const x = Phaser.Math.Between(0, this.game.config.width);
    const meteor = this.meteors.create(x, 0, "meteor");
    meteor.setVelocityY(Phaser.Math.Between(100, 300));
  }

  // Spawn energy orb at random positions
  spawnEnergyOrb() {
    const x = Phaser.Math.Between(800, 1200);
    const y = Phaser.Math.Between(50, 550);
    const energyOrb = this.energyOrbs.create(x, y, "energyOrb");
    energyOrb.setVelocityX(-100);
  }

  // Spawn shield power-up at random positions
  spawnShieldPowerUp() {
    const x = Phaser.Math.Between(800, 1200);
    const y = Phaser.Math.Between(50, 550);
    const shieldPowerUp = this.shieldPowerUps.create(x, y, "shieldPowerUp");
    shieldPowerUp.setVelocityX(-100);
  }

  // Handle player hitting a meteor
  handlePlayerHit(player, meteor) {
    if (this.isShieldActive) {
      meteor.destroy();
      return;
    }
    meteor.destroy();
    this.stopBackgroundMusic();
    this.scene.start("GameOverScene", { score: this.score });

    // Play meteor hit sound
    this.sound.play("meteorHit", { volume: 0.7 });
  }

  // Handle collecting an energy orb
  collectEnergyOrb(player, orb) {
    orb.destroy();
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    // Trigger scoreChanged event
    this.events.emit("scoreChanged", this.score);

    // Play orb collecting sound
    this.sound.play("collectOrb", { volume: 0.5 });
  }

  // Handle collecting a shield power-up
collectShieldPowerUp(player, shieldPowerUp) {
  if (shieldPowerUp) {
    shieldPowerUp.destroy();
  }
  // Activate the shield
  this.isShieldActive = true;

  if (this.shieldGraphics) {
    this.shieldGraphics.setVisible(true);
    this.shieldGraphics.setPosition(this.player.x, this.player.y);
  }

  // Schedule deactivation of the shield
  this.time.delayedCall(5000, () => {
    if (this.isShieldActive) {
      this.isShieldActive = false;
      if (this.shieldGraphics) {
        this.shieldGraphics.setVisible(false);
      }
    }
  });

  // Play sound effect
  if (this.sound) {
    this.sound.play("collectOrb", { volume: 0.5 });
  }
}

  // Increase difficulty by modifying meteor velocities and spawn rates
  increaseDifficulty() {
    console.log("Increasing difficulty");

    this.meteors.children.iterate((meteor) => {
      meteor.setVelocityY(meteor.body.velocity.y + 3);
    });
  }
}
