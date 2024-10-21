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
      // Load player sprite
      this.load.image('player', 'player.png');
      this.load.image('tiles', 'map.png')
    }

    function create() {
        // Add player
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(2)
        this.player.setDepth(1); // Player on top
      
        const map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 25, height: 19 });
        const tiles = map.addTilesetImage('tiles');
      
        // Create the layers (ground and walls)
        const groundLayer = map.createBlankLayer('Ground', tiles, 0, 0);
        const wallLayer = map.createBlankLayer('Walls', tiles, 0, 0);
      
        // Fill the ground layer with a basic tile (index 0 for example)
        groundLayer.fill(18);
      
        // Create walls by setting specific tiles on the wall layer
        wallLayer.putTileAt(82, 10, 5);
        wallLayer.putTileAt(82, 6, 5);
        wallLayer.putTileAt(81, 7, 5);
      
        // Set layer depth
        groundLayer.setDepth(0);
        wallLayer.setDepth(0);
      
        // Add collision to wall tiles
        wallLayer.setCollisionBetween(81, 82);
      
        // Create boundaries (walls)
        const walls = this.physics.add.staticGroup();
        walls.create(400, 0, null).setScale(2, 0.1).refreshBody();
        walls.create(400, 600, null).setScale(2, 0.1).refreshBody();
        walls.create(0, 300, null).setScale(0.1, 2).refreshBody();
        walls.create(800, 300, null).setScale(0.1, 2).refreshBody();
      
        // Add collision between player and boundaries
        this.physics.add.collider(this.player, wallLayer);
      }
      

    function update() {
      const cursors = this.input.keyboard.createCursorKeys();

      if (cursors.left.isDown) {
        this.player.setVelocityX(-160);
      } else if (cursors.right.isDown) {
        this.player.setVelocityX(160);
      } else {
        this.player.setVelocityX(0);
      }

      if (cursors.up.isDown) {
        this.player.setVelocityY(-160);
      } else if (cursors.down.isDown) {
        this.player.setVelocityY(160);
      } else {
        this.player.setVelocityY(0);
      }
    }

    return () => {
      game.destroy(true); // Clean up when the component unmounts
    };
  }, []);

  return <div id="game-container" />;
};

export default GameScene;
