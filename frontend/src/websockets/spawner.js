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

export const spawnLocalCharacter = (scene) =>{
      const spawnPosition = getRandomSpawnPosition();
      scene.player = scene.physics.add.sprite(spawnPosition.x, spawnPosition.y, 'player').setScale(1.5);
      scene.player.setCollideWorldBounds(true);
}