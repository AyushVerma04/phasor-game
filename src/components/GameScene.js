import React, { useEffect } from 'react';
import Phaser from 'phaser';

const GameScene = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image('tiles', 'map.png')
      this.load.image('map', 'mapCustom.png')
      this.load.spritesheet('player', 'spriteMap.png',
        { frameWidth: 32, frameHeight: 48 }
      );
      this.load.spritesheet('walk_down', 'walkdown.png',
        { frameWidth: 40, frameHeight: 48 }
      );
      this.load.spritesheet('walk_up', 'walkup.png',
        { frameWidth: 40, frameHeight: 48 }
      );
      this.load.spritesheet('walk_left', 'walkleft.png',
        { frameWidth: 40, frameHeight: 48 }
      );
      this.load.spritesheet('walk_right', 'walkright.png',
        { frameWidth: 40, frameHeight: 48 }
      );
    }

    function create() {
      this.add.image(0, 0, 'map').setOrigin(0, 0).setScale(0.5);

        this.anims.create({
          key: 'walk_down',
          frames: this.anims.generateFrameNumbers('walk_down', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'walk_left',
          frames: this.anims.generateFrameNumbers('walk_left', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'walk_right',
          frames: this.anims.generateFrameNumbers('walk_right', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'walk_up',
          frames: this.anims.generateFrameNumbers('walk_up', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });

        this.anims.create({
          key: 'stay',
          frames: [ { key: 'walk_down', frame: 0 } ],
          frameRate: 20
        });

        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        this.player.setScale(1.5)
      }
      

      function update() {
        const cursors = this.input.keyboard.createCursorKeys();
      
        // Variable to track if any key is pressed
        let moving = false;
      
        if (cursors.left.isDown) {
          this.player.anims.play('walk_left', true);
          this.player.setVelocityX(-160);
          this.player.setVelocityY(0);
          moving = true;
        } else if (cursors.right.isDown) {
          this.player.anims.play('walk_right', true);
          this.player.setVelocityX(160);
          this.player.setVelocityY(0);
          moving = true;
        } else {
          this.player.setVelocityX(0);
        }
      
        if (cursors.up.isDown) {
          this.player.anims.play('walk_up', true);
          this.player.setVelocityX(0);
          this.player.setVelocityY(-160);
          moving = true;
        } else if (cursors.down.isDown) {
          this.player.anims.play('walk_down', true);
          this.player.setVelocityX(0);
          this.player.setVelocityY(160);
          moving = true;
        } else {
          this.player.setVelocityY(0);
        }
      
        // If no movement keys are pressed, play the 'stay' animation
        if (!moving) {
          this.player.anims.play('stay', true);
        }
      }
      

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default GameScene;
