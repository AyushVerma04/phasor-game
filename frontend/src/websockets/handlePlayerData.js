import { getRandomSpawnPosition } from "./spawner";

export const handlePlayer = (socket, players, myId, scene) => {

  const player = players[myId];
  let moving = handleMovement(scene.cursors, player);

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

  socket.on('playerData', (data) => updatePlayerData(data, players, myId, scene));
  socket.on('newPlayer', (id) => handleNewPlayer(id, players, scene));
  socket.on('playerDisconnected', (id) => handlePlayerDisconnect(id, players));
  socket.on('connect_error', handleError);
}

export const handleNewPlayer = (id, players) => {
  console.log(players);
  console.log('New player joined:', id);
}

const handlePlayerDisconnect = (id, players) => {
  if (players[id]) {
    players[id].nameTag.destroy();
    players[id].destroy();
    delete players[id];
  }
}

const updatePlayerData = (data, players, myId, scene) => {
    for (const id in data) {
      if (id === myId) {
        continue;
      }

      if (!players[id]) {
        const spawnPosition = getRandomSpawnPosition();
        players[id] = scene.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
        players[id].setCollideWorldBounds(true);
        
        const nameTag = scene.add.text(spawnPosition.x, spawnPosition.y - 20, 'PLAYER', {
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
  };

export const handleMovement = (cursors, player) => {
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

const handleError = (err) => {
  console.error('Socket connection error:', err);
}
  