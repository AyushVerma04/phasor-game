const spawnPositions = [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 100, y: 500 },
    { x: 700, y: 500 },
    { x: 400, y: 300 }
  ];

export const getRandomSpawnPosition = () => {
  return spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
};

export const spawnLocalCharacter = (scene, players) => {
  if (!scene.player) {  // Ensure player is only spawned if it doesn't already exist
    const spawnPosition = getRandomSpawnPosition();
    scene.player = scene.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
    players[scene.player.id] = scene.player
    const localUsername = 'LOCAL'

    scene.player.setCollideWorldBounds(true);

    const nameTag = scene.add.text(spawnPosition.x, spawnPosition.y - 35, `${localUsername}`, {
      fontSize: '18px',
      fill: '#fff'
    }).setOrigin(0.5, 1);

    players[scene.player.id].nameTag = nameTag;
  }
};

export const updateLocalPlayerNametag = (scene, players, id) => {
  // players[id].username = 'RandomUser' + Math.random(1, 100).toFixed(2)*100;
  players[scene.player.id].nameTag.setPosition(players[scene.player.id].x, players[scene.player.id].y - 35);
}