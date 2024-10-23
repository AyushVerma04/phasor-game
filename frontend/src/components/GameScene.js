import React, { useEffect } from 'react';
import Phaser from 'phaser';
import io from 'socket.io-client';
import { createCharacterAnimations } from '../anims/CharacterAnims';
import { preloadAssets } from '../scenes/Preloader';
import { getRandomSpawnPosition } from '../websockets/spawner';
import { handleMovement, handleNewPlayer, handlePlayerDisconnect, updatePlayerData } from '../websockets/handlePlayerData';

const socket = io('http://172.16.100.81:3000');

const GameScene = () => {
  useEffect(() => {
    const players = {};
    let myId;

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
      preloadAssets(this);
    }
  
    function create() {

      this.add.image(0, 0, 'map').setOrigin(0, 0).setScale(0.5);
      createCharacterAnimations(this);
  
      const spawnPosition = getRandomSpawnPosition();
      this.player = this.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
      this.player.setCollideWorldBounds(true);
  
      myId = 'localPlayer';
  
      players[myId] = this.player;

      this.physics.world.setBounds(0, 0, 1600, 1200); 
      this.cameras.main.setBounds(0, 0, 1600, 1200);   // Make sure the camera is restricted to the world bounds
      this.cameras.main.startFollow(this.player);
  
      this.cursors = this.input.keyboard.createCursorKeys();
  
      socket.on('playerData', (data) => updatePlayerData(data, players,myId, this));
      socket.on('newPlayer', (id) => handleNewPlayer(id, players, this));
      socket.on('playerDisconnected', (id) => handlePlayerDisconnect(id, players));
      socket.on('connect_error', handleError);
    }

    function update() {
      if (!myId || !players[myId]) return;
  
      const player = players[myId];
      let moving = handleMovement(this.cursors, player, this);
  
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
