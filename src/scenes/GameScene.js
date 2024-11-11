export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player;
        this.meteors;
        this.energyOrbs;
        this.cursors;
        this.score = 0;
        this.shields = 0;
        this.speedBoosts = 0;
        this.scoreText;
        this.backgroundMusic;  // For background music
        this.isMovingSideways = false;  // Track if already moving sideways
    }

    preload() {
        // Load assets (images, sprites, and sounds)
        this.load.image('background', '/background.png');
        this.load.image('gameOver', '/gameover.png');
        this.load.image('meteor', '/meteor.png');
        this.load.image('energyOrb', '/energyOrb.png');
        this.load.spritesheet("spaceship", "/spaceship.png", {
            frameWidth: 64,
            frameHeight: 64,
        });

        // Load audio files
        this.load.audio('backgroundMusic', '/backgroundMusic.mp3');  // Background music
        this.load.audio('collectOrb', '/collectOrb.mp3');  // Sound for collecting orbs
        this.load.audio('meteorHit', '/meteorHit.mp3');  // Sound for meteor collision
        this.load.audio('woosh', '/woosh.mp3');  // Sound for sideways movement
        console.log('Assets loaded');
    }

    create() {
        // Add the background
        this.add.image(400, 300, 'background').setOrigin(0.5, 0.5);

        // Create player spaceship
        this.player = this.physics.add.sprite(375, 500, 'spaceship');
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);

        // Create groups for meteors and energy orbs
        this.meteors = this.physics.add.group();
        this.energyOrbs = this.physics.add.group();

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Initialize the score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#FDFD96'
        });

        // Play background music (looping)
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.backgroundMusic.play({
            loop: true,  // Loops the background music
            volume: 0.2  // You can adjust the volume here (range 0 to 1)
        });

        // Woosh sound
        this.wooshSound = this.sound.add('woosh', { volume: 0.5 });

        // Spawn meteors and energy orbs
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

        // Set up collisions
        this.physics.add.overlap(this.player, this.meteors, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.player, this.energyOrbs, this.collectEnergyOrb, null, this);

        // Create player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 4, end: 2 }),
            frameRate: 5,
            repeat: 0  // Play once, no repeat
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'spaceship', frame: 4 }],
            frameRate: 2,
            repeat: 0
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('spaceship', { start: 4, end: 6 }),
            frameRate: 5,
            repeat: 0
        });
    }

    update() {
        // Movement logic
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (!this.isMovingSideways) {
                this.wooshSound.play(); // Play woosh sound on first left/right press
                this.isMovingSideways = true;
            }
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (!this.isMovingSideways) {
                this.wooshSound.play();
                this.isMovingSideways = true;
            }
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            if (this.isMovingSideways) {
                this.isMovingSideways = false; // Reset sideways movement state
            }
            this.player.anims.play('turn', true);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
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
        const meteor = this.meteors.create(x, 0, 'meteor');
        meteor.setVelocityY(Phaser.Math.Between(100, 300));
    }

    // Spawn energy orb at random positions
    spawnEnergyOrb() {
        const x = Phaser.Math.Between(800, 1200);
        const y = Phaser.Math.Between(50, 550);
        const energyOrb = this.energyOrbs.create(x, y, 'energyOrb');
        energyOrb.setVelocityX(-100);
    }

    // Handle player hitting a meteor
    handlePlayerHit(player, meteor) {
        meteor.destroy();
        this.stopBackgroundMusic();  // Stop the background music when game ends
        this.scene.start('GameOverScene', { score: this.score });

        // Play meteor hit sound
        this.sound.play('meteorHit', { volume: 0.7 });
    }

    // Handle collecting an energy orb
    collectEnergyOrb(player, orb) {
        orb.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Play orb collecting sound
        this.sound.play('collectOrb', { volume: 0.5 });
    }

    // Increase difficulty by modifying meteor velocities
    increaseDifficulty() {
        this.meteors.children.iterate((meteor) => {
            meteor.setVelocityY(meteor.body.velocity.y + 1);
            meteor.setVelocityX(meteor.body.velocity.x + 1);
        });
    }
}
