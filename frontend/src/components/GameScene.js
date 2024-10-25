import React, { useEffect } from 'react';
import Phaser from 'phaser';
import io from 'socket.io-client';
import { createCharacterAnimations } from '../anims/CharacterAnims';
import { preloadAssets } from '../scenes/Preloader';
import { handlePlayer } from '../websockets/handlePlayerData';
import { spawnLocalCharacter } from '../websockets/spawner';
import { createMapAnimations } from '../anims/MapAnims';

const socket = io('https://phasor-game.onrender.com');
// const socket = io('http://localhost:3000');

const GameScene = () => {
  useEffect(() => {
    const players = {};
    let myId;

    const config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 900,
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

      // this.add.image(0, 0, 'map').setOrigin(0, 0).setScale(0.5);
      // const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
      // const tileset = map.addTilesetImage('fantasy', 'fantasy');
      // const tileset2 = map.addTilesetImage('fantasy', 'fantasy');
      // const GroundLayer = map.createLayer(0, tileset2, 0, 0);
      // const WallLayer = map.createLayer(1, tileset, 0, 0);

      

      // WallLayer.setCollisionByProperty({ collides: true });
      // WallLayer.setCollisionBetween(0,1200);
      
      const mapBackground = this.add.sprite(0, 0, 'animatedMap').setOrigin(0, 0).setScale(1.25);
      createMapAnimations(this);
      mapBackground.play('mapAnimation');

      createCharacterAnimations(this);
      spawnLocalCharacter(this, players);

      
      // this.physics.add.collider(this.player, WallLayer);
      myId = 'localPlayer';
  
      players[myId] = this.player;

      this.physics.world.setBounds(0, 0, 1600, 900); 
      this.cameras.main.setBounds(0, 0, 1600, 900);   // Make sure the camera is restricted to the world bounds
      this.cameras.main.startFollow(this.player);
  
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    function update() {
      if (!myId || !players[myId]) return;
      
      handlePlayer(socket, players, myId, this);
      // updateLocalPlayerNameTag(this, players)
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
