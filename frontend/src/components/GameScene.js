import React, { useEffect } from 'react';
import Phaser from 'phaser';
import io from 'socket.io-client';

const socket = io('http://172.16.100.81:3000');

const GameScene = () => {
  useEffect(() => {
    const players = {};
    let myId;

    const spawnPositions = [
      { x: 100, y: 100 },
      { x: 700, y: 100 },
      { x: 100, y: 500 },
      { x: 700, y: 500 },
      { x: 400, y: 300 }
    ];
  
    const getRandomSpawnPosition = () => {
      return spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    };

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
      console.log("Loading assets...");
      this.load.image('map', 'mapCustom.png');
      this.load.spritesheet('player', 'spriteMap.png', { frameWidth: 32, frameHeight: 48 });
      this.load.spritesheet('walk_down', 'walkdown.png', { frameWidth: 40, frameHeight: 48 });
      this.load.spritesheet('walk_up', 'walkup.png', { frameWidth: 40, frameHeight: 48 });
      this.load.spritesheet('walk_left', 'walkleft.png', { frameWidth: 40, frameHeight: 48 });
      this.load.spritesheet('walk_right', 'walkright.png', { frameWidth: 40, frameHeight: 48 });
    }
  
    function create() {
      this.add.image(0, 0, 'map').setOrigin(0, 0).setScale(0.5);
      createAnimations.call(this);
  
      const spawnPosition = getRandomSpawnPosition();
      this.player = this.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
      this.player.setCollideWorldBounds(true);
  
      myId = 'localPlayer';
  
      players[myId] = this.player;
  
      this.cursors = this.input.keyboard.createCursorKeys();
  
      socket.on('playerData', updatePlayerData.bind(this));
      socket.on('newPlayer', handleNewPlayer.bind(this));
      socket.on('playerDisconnected', handlePlayerDisconnect.bind(this));
      socket.on('connect_error', handleError);
    }
  
    function createAnimations() {
      const animationConfig = {
        frameRate: 10,
        repeat: -1
      };
  
      this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('walk_down', { start: 0, end: 3 }),
        ...animationConfig
      });
      this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('walk_left', { start: 0, end: 3 }),
        ...animationConfig
      });
      this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('walk_right', { start: 0, end: 3 }),
        ...animationConfig
      });
      this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('walk_up', { start: 0, end: 3 }),
        ...animationConfig
      });
      this.anims.create({
        key: 'stay',
        frames: [{ key: 'walk_down', frame: 0 }],
        frameRate: 20
      });
    }
  
    function update() {
      if (!myId || !players[myId]) return;
  
      const player = players[myId];
      let moving = handleMovement.call(this, this.cursors, player);
  
      if (!moving) {
        player.anims.play('stay', true);
      }
  
      // Emit the player's updated position to the server, including animation state
      socket.emit('playerMove', {
        id: myId,
        x: player.x,
        y: player.y,
        anim: player.anims.currentAnim ? player.anims.currentAnim.key : 'stay'
      });
    }
  
    function handleMovement(cursors, player) {
      let moving = false;
  
      if (cursors.left.isDown) {
        player.anims.play('walk_left', true);
        player.setVelocityX(-160);
        moving = true;
      } else if (cursors.right.isDown) {
        player.anims.play('walk_right', true);
        player.setVelocityX(160);
        moving = true;
      } else {
        player.setVelocityX(0);
      }
  
      if (cursors.up.isDown) {
        player.anims.play('walk_up', true);
        player.setVelocityY(-160);
        moving = true;
      } else if (cursors.down.isDown) {
        player.anims.play('walk_down', true);
        player.setVelocityY(160);
        moving = true;
      } else {
        player.setVelocityY(0);
      }
  
      return moving;
    }
  
    function handleNewPlayer(id) {
      console.log(players);
      console.log('New player joined:', id);
  
      // If a new player joins, spawn them at a random position
      // if (!players[id]) {
      //   const spawnPosition = getRandomSpawnPosition();
      //   players[id] = this.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
      //   players[id].setCollideWorldBounds(true);
      // }
    }
  
    function updatePlayerData(data) {
      for (const id in data) {
        if (id === myId) {
          continue; // Skip the local player
        }
    
        if (!players[id]) {
          const spawnPosition = getRandomSpawnPosition();
          players[id] = this.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
          players[id].setCollideWorldBounds(true);
          players[id].body.setCollideWorldBounds(true);
          
          const nameTag = this.add.text(spawnPosition.x, spawnPosition.y - 20, 'PLAYER', { 
            fontSize: '18px', 
            fill: '#fff' 
          }).setOrigin(0.5, 1);
    
          players[id].nameTag = nameTag;
        } else {
          players[id].setPosition(data[id].x, data[id].y);
        }

        if (players[id].nameTag) {
          players[id].nameTag.setPosition(players[id].x, players[id].y - 35); 
        }
    
        if (data[id].anim && players[id].anims) {
          players[id].anims.play(data[id].anim, true);
        }
      }
    }
  
    function handlePlayerDisconnect(id) {
      if (players[id]) {
        players[id].destroy();
        delete players[id];
      }
    }
  
    function handleError(err) {
      console.error('Socket connection error:', err);
    }
  
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default GameScene;
