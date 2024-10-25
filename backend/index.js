const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

const PORT = process.env.PORT || 3000;

// Define fixed spawn positions
const spawnPositions = [
  { x: 100, y: 100 },
  { x: 700, y: 100 },
  { x: 100, y: 500 },
  { x: 700, y: 500 },
  { x: 400, y: 300 }
];

// Function to get a random spawn position
const getRandomSpawnPosition = () => {
  return spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
};

const players = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Initialize player position and animation state with random spawn position
  const spawnPosition = getRandomSpawnPosition();
  players[socket.id] = {
    username: 'User' + Math.random().toFixed(3).slice(2, 5), // Random username generation
    x: spawnPosition.x,
    y: spawnPosition.y,
    anim: 'stay' // Default animation state
  };

  // Send the full player list to the newly connected player
  socket.emit('playerData', players);

  // Notify all other players about the new player only once
  socket.broadcast.emit('newPlayer', {
    id: socket.id,
    username: players[socket.id].username,
    x: players[socket.id].x,
    y: players[socket.id].y,
    anim: players[socket.id].anim
  });

  // Listen for player movement and animation updates
  socket.on('playerMove', (data) => {
    if (players[socket.id]) {
      // Update the player's position and animation state
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      players[socket.id].anim = data.anim;

      // Broadcast the updated player data to all clients
      io.emit('playerData', players); // Update all clients with the new player data
    }
  });

  // Remove player on disconnect
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    
    // Notify all clients about the disconnection
    io.emit('playerDisconnected', socket.id);
    io.emit('playerData', players); // Update remaining players after disconnect
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
