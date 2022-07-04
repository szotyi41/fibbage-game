export default function PlayerDisconnected(socket, io, data, callback) {
        /* const player = globalPlayers[socket.id];

        // Remove this player from all other game rooms' player lists
        if (typeof player !== 'undefined') {
            player.removeFromAllRooms(globalGameRooms);
        }

        // Remove socket connection
        globalConnections.splice(globalConnections.indexOf(socket), 1);
        console.log(
            socket.id,
            'is disconnected: ',
            globalConnections.length,
            ' globalConnections remaining'
        );

        // send update to all globalPlayers
        io.sockets.emit('update_globalPlayers', globalPlayers);
        io.sockets.emit('update_game_rooms', { rooms: globalGameRooms }); */
    
}
