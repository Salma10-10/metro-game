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
        this.scoreText; // Add a score text variable
    }

    preload() {
        // Load assets (images, sprites)
        this.load.image('background', '/background.png'); // Update with the correct path
        this.load.image('gameOver', '/gameover.png'); // Update with the correct path
        this.load.image('meteor', '/meteor.png'); 
        this.load.image('energyOrb', '/energyOrb.png');
        this.load.spritesheet("spaceship", "/spaceship.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        console.log('Assets loaded');
    }

    create() {
        // Add the background
        this.add.image(400, 300, 'background').setOrigin(0.5, 0.5); // Adjust positioning as needed
        // Create player spaceship
        this.player = this.physics.add.sprite(375, 500, 'spaceship');
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);

        // Create groups for meteors and energy orbs
        this.meteors = this.physics.add.group();
        this.energyOrbs = this.physics.add.group();

        // Set up keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Initialize the score text in the top left corner
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '32px',
            fill: '#FDFD96'
        });

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
            repeat: 0 // Play once, no repeat
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
        // Check if moving left
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);


            // Play 'left' animation only if not currently playing
            // Play the 'left' animation only if it’s not currently playing
            if (this.player.anims.currentAnim?.key !== 'left') {
                this.player.anims.play('left'); // Play 'left' animation without looping
            }

            // After the animation completes, hold on the last frame
            if (!this.player.anims.isPlaying && this.player.anims.currentAnim?.key === 'left') {
                this.player.setFrame(0); // Set to the last frame of 'left' animation
            }

        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);

            // Play the 'right' animation only if it’s not currently playing
            if (this.player.anims.currentAnim?.key !== 'right') {
                this.player.anims.play('right'); // Play 'right' animation without looping
            }

            // After the animation completes, hold on the last frame
            if (!this.player.anims.isPlaying && this.player.anims.currentAnim?.key === 'right') {
                this.player.setFrame(8); // Set to the last frame of 'right' animation
            }
        } else {
            // If no horizontal input, set velocity to 0
            this.player.setVelocityX(0);

            // Play idle animation if not already playing
            if (this.player.anims.currentAnim?.key !== 'turn') {
                this.player.anims.play('turn');
            }
        }

        // Handle vertical movement (no animation for up/down movement)
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200);
        } else {
            this.player.setVelocityY(0);
        }
    }







    spawnMeteor() {
        const x = Phaser.Math.Between(0, this.game.config.width);
        const meteor = this.meteors.create(x, 0, 'meteor');
        meteor.setVelocityY(Phaser.Math.Between(100, 300));
    }

    spawnEnergyOrb() {
        const x = Phaser.Math.Between(800, 1200);
        const y = Phaser.Math.Between(50, 550);
        const energyOrb = this.energyOrbs.create(x, y, 'energyOrb');
        energyOrb.setVelocityX(-100);
    }

    handlePlayerHit(player, meteor) {
        meteor.destroy();
        this.scene.start('GameOverScene', { score: this.score });
    }

    collectEnergyOrb(player, orb) {
        orb.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score); // Update the score text
    }

    increaseDifficulty() {
        this.meteors.children.iterate((meteor) => {
            meteor.setVelocityY(meteor.body.velocity.y + 1);
            meteor.setVelocityX(meteor.body.velocity.x + 1);
        });
    }
}
