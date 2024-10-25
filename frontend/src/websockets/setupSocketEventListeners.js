import { handleError, handleNewPlayer, handlePlayerDisconnect, updatePlayerData } from "./handlePlayerData";

export const setupSocketEventListeners = (socket, players, scene) => {
    socket.on('playerData', (data) => updatePlayerData(data, players, socket.id, scene));
    socket.on('newPlayer', (newPlayer) => handleNewPlayer(newPlayer, players, scene));
    socket.on('playerDisconnected', (id) => handlePlayerDisconnect(id, players));
    socket.on('connect_error', handleError);
}