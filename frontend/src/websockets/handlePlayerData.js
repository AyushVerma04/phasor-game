import { getRandomSpawnPosition } from "./spawner";

export const handleNewPlayer = (id, players) => {
  console.log(players);
  console.log('New player joined:', id);
}

export const handlePlayerDisconnect = (id, players) => {
  if (players[id]) {
    players[id].nameTag.destroy();
    players[id].destroy();
    delete players[id];
  }
}

export const updatePlayerData = (data, players, myId, scene) => {
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

export const handleMovement = (cursors, player, scene) => {
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
  