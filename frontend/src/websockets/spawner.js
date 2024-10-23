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